import { api } from "./api";

export type ActivityType = 'upload' | 'chat' | 'summary' | 'quiz';

export interface Activity {
  id: string;
  title: string;
  date: string;
  timestamp: number;
  score: string;
  type: ActivityType;
}

export const historyService = {
  getActivities: async (): Promise<Activity[]> => {
    try {
      const data = await api.getHistory();
      return data.activities || [];
    } catch (error) {
      console.error('Failed to fetch history:', error);
      return [];
    }
  },

  addActivity: async (activity: Omit<Activity, 'id' | 'date' | 'timestamp'>) => {
    try {
      const newActivity = await api.addActivity(activity);
      
      // Dispatch event for components to react to new activity
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new CustomEvent('study-activity-added', { detail: newActivity }));
      }
      
      return newActivity;
    } catch (error) {
      console.error('Failed to add activity:', error);
    }
  },

  clearHistory: () => {
    // Backend clearing not implemented yet, but we can clear local if we want
    // Usually this should be a DELETE /history endpoint
    console.warn("clearHistory not yet implemented on backend");
  },

  getStats: (activities: Activity[]) => {
    const stats = {
      avgScore: 0,
      notesAnalyzed: 0,
      totalChat: 0,
    };

    const quizScores = activities
      .filter(a => a.type === 'quiz' && a.score.includes('%'))
      .map(a => parseInt(a.score));
    
    if (quizScores.length > 0) {
      stats.avgScore = Math.round(quizScores.reduce((a, b) => a + b, 0) / quizScores.length);
    }

    stats.notesAnalyzed = activities.filter(a => a.type === 'upload' || a.type === 'summary').length;
    stats.totalChat = activities.filter(a => a.type === 'chat').length;

    return stats;
  },

  getWeeklyData: (activities: Activity[]) => {
    const data = [0, 0, 0, 0, 0, 0, 0]; // Mon-Sun
    const now = new Date();
    
    activities.forEach(a => {
        const date = new Date(a.timestamp);
        const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 3600 * 24));
        if (diffDays < 7) {
            let dayIndex = date.getDay(); // 0 is Sun, 1 is Mon...
            // Adjust to Mon-Sun (0-6)
            dayIndex = dayIndex === 0 ? 6 : dayIndex - 1;
            if (dayIndex >= 0 && dayIndex < 7) {
                data[dayIndex]++;
            }
        }
    });

    // Normalize height for chart (max 100)
    const maxVal = Math.max(...data, 1);
    return data.map(v => Math.max((v / maxVal) * 100, 10)); // Min 10% height
  },

  getSubjectMastery: (activities: Activity[]) => {
    // Keyword mappings for subjects
    const subjects = [
      { name: 'Biology', color: 'bg-green-500', keywords: ['bio', 'cell', 'organ', 'plant', 'animal', 'brain', 'gene'] },
      { name: 'Computer Science', color: 'bg-themePurple-500', keywords: ['code', 'data', 'algorithm', 'python', 'computer', 'tech', 'software', 'programming'] },
      { name: 'Mathematics', color: 'bg-orange-400', keywords: ['math', 'calc', 'algebra', 'equation', 'number', 'geometry', 'theorem'] },
      { name: 'Physics', color: 'bg-blue-500', keywords: ['physic', 'quantum', 'mechanic', 'energy', 'force', 'motion'] },
      { name: 'Literature', color: 'bg-rose-500', keywords: ['lit', 'book', 'author', 'poem', 'novel', 'read'] },
      { name: 'History', color: 'bg-yellow-500', keywords: ['histor', 'war', 'century', 'ancient', 'world', 'era'] },
      { name: 'General Knowledge', color: 'bg-teal-500', keywords: ['general', 'info', 'study'] }
    ];

    const results: {name: string, percent: number, color: string}[] = [];

    // Check each activity title against subject keywords
    subjects.forEach(subject => {
      const matchingActivities = activities.filter(a => 
        subject.keywords.some(k => a.title.toLowerCase().includes(k))
      );

      if (matchingActivities.length > 0) {
        // Calculate mastery
        let score = 30; // base score for just uploading something
        
        // Quizzes hold more weight
        const quizzes = matchingActivities.filter(a => a.type === 'quiz' && a.score.includes('%'));
        if (quizzes.length > 0) {
           const avgQuiz = quizzes.reduce((acc, q) => acc + parseInt(q.score.replace('%', '')), 0) / quizzes.length;
           score = Math.floor((30 + avgQuiz) / 2) + 20; // e.g. avg 80 -> (30+80)/2 + 20 = 75
        } else {
           // If no quizzes, give points for activities
           score += Math.min(50, matchingActivities.length * 15);
        }

        // Cap at 98%
        score = Math.min(98, score);

        results.push({
          name: subject.name,
          percent: score,
          color: subject.color
        });
      }
    });

    return results.sort((a, b) => b.percent - a.percent).slice(0, 4);
  }
};

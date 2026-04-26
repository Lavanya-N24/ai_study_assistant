import FileUpload from "../../components/FileUpload";

export default function UploadPage() {
  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-slate-800 mb-3">Upload Document</h1>
        <p className="text-slate-500 max-w-lg mx-auto">
          Add your PDF materials here to initialize the AI memory. Make sure it&apos;s clear and contains text data.
        </p>
      </div>
      
      <FileUpload />
    </div>
  );
}

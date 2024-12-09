import AudioUpload from "@/components/AudioUpload";
import ProtectedPage from "@/context/ProtectedPage";


export default async function HomePage() {
  
  return (
    <>
    <ProtectedPage />
      <AudioUpload />
    </>
  );
}



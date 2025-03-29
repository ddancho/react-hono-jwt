import { useAuthContext } from "../context/AuthContext";

function HomePage() {
  const { authUser } = useAuthContext();
  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex justify-center h-full rounded-lg overflow-hidden">
            {authUser && <h2>Hello {authUser.username}!</h2>}
            {!authUser && <h2>I don&apos;t know you!</h2>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;

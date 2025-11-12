import { currentUser } from "@clerk/nextjs/server";

export default async function DebugPage() {
  const user = await currentUser();

  if (!user) {
    return <div>Not signed in</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Debug User Info</h1>
      <pre className="bg-gray-100 p-4 rounded">
        {JSON.stringify(
          {
            id: user.id,
            email: user.emailAddresses[0]?.emailAddress,
            publicMetadata: user.publicMetadata,
            privateMetadata: user.privateMetadata,
            unsafeMetadata: user.unsafeMetadata,
          },
          null,
          2
        )}
      </pre>
    </div>
  );
}
export default function UserPage() {

  const user = {
    name: 'John Doe',
    username: '@johndoe',
    email: 'john.doe@example.com',
    location: 'San Francisco, CA',
    avatar: 'https://source.unsplash.com/random/100x100',
  };

  return (
    <>
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="flex items-center space-x-5">
              <img
                src={user.avatar}
                alt="User Avatar"
                className="block mx-auto h-24 rounded-full sm:mx-0 sm:flex-shrink-0"
              />
              <div className="pt-6 text-center sm:pt-0 sm:text-left sm:flex-grow">
                <h1 className="text-3xl font-bold text-gray-900">
                  {user.name}
                </h1>
                <p className="text-xl text-gray-600">{user.username}</p>
              </div>
            </div>
            <div className="mt-8 space-y-6">
              <p className="text-sm text-gray-600">Email:</p>
              <p className="text-lg font-semibold text-gray-900">{user.email}</p>
              <p className="text-sm text-gray-600">Location:</p>
              <p className="text-lg font-semibold text-gray-900">{user.location}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

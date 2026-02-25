import LoginButton from '../components/LoginButton'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-960 px-6">
      <div className="bg-gray-200 p-8 rounded-xl shadow-lg w-96">
        <h1 className="text-indigo-950 text-2xl font-bold mb-6 text-center">
          Client Dashboard
        </h1>
        <div className='flex justify-center'><LoginButton /></div>
      </div>
    </div>
  )
}
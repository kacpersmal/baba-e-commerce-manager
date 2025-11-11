import AuthForm from './auth-form'
export default function AuthContainer() {
  return (
    <div className={`fixed inset-0 z-50 backdrop-blur-sm`}>
      <div className="flex h-full flex-col items-center justify-center p-6 md:p-10 ">
        <div className="w-full min-h-[70%] min-w-[50%] max-w-sm md:max-w-3xl h-5/6 flex flex-col justify-center ">
          <AuthForm />
        </div>
      </div>
    </div>
  )
}

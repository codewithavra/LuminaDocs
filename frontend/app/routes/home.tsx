import { SignIn, SignInButton } from "@clerk/react-router";
import { Button } from "~/components/ui/button"

export default function Home() {
  return (
    <div>
      <SignIn />
      <SignInButton />
    </div>
  )
}

import React from "react";
import { useState } from "react";
import { AuthLayout } from "./AuthLayout";
import { SignInForm } from "./SignInForm";
import { SignUpForm } from "./SignUpForm";
import { Button } from "@/components/ui/button";

const AuthPage = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  return (
    <>
      <AuthLayout
        title={isSignIn ? "Welcome back" : "Create an account"}
        subtitle={
          isSignIn
            ? "Enter your credentials to access your account"
            : "Start creating and sharing roadmaps today"
        }
      >
        {isSignIn ? <SignInForm /> : <SignUpForm />}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            {isSignIn ? "Don't have an account?" : "Already have an account?"}
          </p>
          <Button
            variant="link"
            className="mt-2"
            onClick={() => setIsSignIn(!isSignIn)}
          >
            {isSignIn ? "Create an account" : "Sign in"}
          </Button>
        </div>
      </AuthLayout>
    </>
  );
};

export default AuthPage;

// app/user/profile/page.tsx
import { Metadata } from "next";
import { auth } from "@/auth-helpers/server";
import SessionWrapper from "@/components/sessionWrapper";
import ProfileForm from "./profile-form";

export const metadata: Metadata = {
  title: "Customer Profile",
};

const Profile = async () => {
  const session = await auth();

  return (
    <SessionWrapper session={session}>
      <div className="max-w-md mx-auto space-y-4">
        <h2 className="h2-bold">Profile</h2>
        <ProfileForm />
      </div>
    </SessionWrapper>
  );
};

export default Profile;

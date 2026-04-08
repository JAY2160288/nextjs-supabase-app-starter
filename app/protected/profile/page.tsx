import { redirect } from "next/navigation";

import ProfileForm from "@/components/profile-form";
import { createClient } from "@/lib/supabase/server";

export default async function ProfilePage() {
  const supabase = await createClient();

  // 현재 로그인한 사용자 확인
  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();
  if (claimsError || !claimsData?.claims) {
    redirect("/auth/login");
  }

  const userId = claimsData.claims.sub;

  // profiles 테이블에서 사용자 프로필 조회
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (profileError || !profile) {
    // 프로필이 없으면 (트리거 오류 등) 생성 후 다시 시도
    await supabase.from("profiles").insert({ id: userId });
    redirect("/protected/profile");
  }

  return (
    <div className="flex w-full max-w-2xl flex-1 flex-col gap-8">
      <div>
        <h1 className="mb-1 text-2xl font-bold">프로필 설정</h1>
        <p className="text-sm text-muted-foreground">
          회원 정보를 확인하고 수정할 수 있습니다.
        </p>
      </div>

      <ProfileForm profile={profile} />
    </div>
  );
}

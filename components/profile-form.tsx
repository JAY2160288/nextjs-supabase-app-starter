"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import type { Tables } from "@/types/database.types";

// profiles 테이블의 Row 타입을 재사용
type Profile = Tables<"profiles">;

interface ProfileFormProps {
  profile: Profile;
}

export default function ProfileForm({ profile }: ProfileFormProps) {
  // 폼 입력값 상태 — 초기값은 DB에서 불러온 프로필 데이터
  const [fullName, setFullName] = useState(profile.full_name ?? "");
  const [username, setUsername] = useState(profile.username ?? "");
  const [bio, setBio] = useState(profile.bio ?? "");
  const [website, setWebsite] = useState(profile.website ?? "");
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url ?? "");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // profiles 테이블에서 현재 사용자 레코드를 업데이트
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        username: username,
        bio: bio,
        website: website,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", profile.id);

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({ type: "success", text: "프로필이 저장되었습니다." });
    }

    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-md flex-col gap-4">
      {/* 이메일은 Auth에서 관리하므로 읽기 전용 */}
      <div className="flex flex-col gap-1">
        <Label htmlFor="email">이메일</Label>
        <Input id="email" value={profile.email ?? ""} disabled />
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="fullName">이름</Label>
        <Input
          id="fullName"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="홍길동"
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="username">사용자명</Label>
        <Input
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="hong123"
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="bio">자기소개</Label>
        <Input
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="간단한 소개를 입력하세요"
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="website">웹사이트</Label>
        <Input
          id="website"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          placeholder="https://example.com"
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="avatarUrl">아바타 URL</Label>
        <Input
          id="avatarUrl"
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
          placeholder="https://example.com/avatar.png"
        />
      </div>

      {/* 저장/에러 메시지 */}
      {message && (
        <p
          className={
            message.type === "success" ? "text-green-600" : "text-red-600"
          }
        >
          {message.text}
        </p>
      )}

      <Button type="submit" disabled={loading}>
        {loading ? "저장 중..." : "저장"}
      </Button>
    </form>
  );
}

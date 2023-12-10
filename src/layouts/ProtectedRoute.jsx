import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { LOGIN_PATH } from "../common/constants";
import { getMemberInfoRequest } from "../apis/auth-api";
import { useRecoilState } from "recoil";
import { MemberInfoAtom } from "../atoms/MemberInfoAtom";
import { useState } from "react";

export default function ProtectedRoute() {
  const [memberInfo, setMemberInfo] = useRecoilState(MemberInfoAtom);
  const [isLoading, setIsLoading] = useState(true);
  const currLocation = useLocation();

  const getMemberRequestAsync = async () => {
    try {
      const { data } = await getMemberInfoRequest();
      setMemberInfo(data.data);
    } catch (err) {
      if (err.response.status === 401) {
        return;
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getMemberRequestAsync();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return memberInfo ? (
    <Outlet />
  ) : (
    <Navigate
      to={LOGIN_PATH()}
      replace
      state={{ redirectedFrom: currLocation }}
    />
  );
}

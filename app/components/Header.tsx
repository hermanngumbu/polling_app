import Link from "next/link";
import { cookies } from "next/headers";
import { Button } from "@/components/ui/button";

async function Header() {
  const cookieStore = cookies();
  const userCookie = cookieStore.get("user");
  const user = userCookie ? JSON.parse(userCookie.value) : null;

  return (
    <header className="bg-gray-100 dark:bg-gray-800 py-4 px-6 flex items-center justify-between">
      <Link href="/polls" className="text-2xl font-bold">
        Polling App
      </Link>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span>Welcome, {user.email}</span>
            <form action="/logout" method="post">
              <Button type="submit" variant="outline">Logout</Button>
            </form>
          </>
        ) : (
          <>
            <Button asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/signup">Sign Up</Link>
            </Button>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { School, LogIn } from 'lucide-react';
import { teachers } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [role, setRole] = useState('admin');
  const [teacher, setTeacher] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // This is a mock authentication.
    // In a real app, you would validate credentials against a backend.
    setTimeout(() => {
      let isAuthenticated = false;
      if (role === 'admin' && password === 'admin') {
        isAuthenticated = true;
      } else if (role === 'teacher' && teacher && password === 'password') {
        isAuthenticated = true;
      }

      if (isAuthenticated) {
        // In a real app, you'd set a session cookie or token.
        // For this demo, we'll use localStorage.
        try {
          localStorage.setItem('isAuthenticated', 'true');
          router.push('/dashboard');
        } catch (error) {
           toast({
            variant: 'destructive',
            title: 'Login Failed',
            description: 'Could not save session. Please enable cookies/local storage.',
          });
        }
      } else {
        toast({
          variant: 'destructive',
          title: 'Login Failed',
          description: 'Invalid credentials. Please try again.',
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center gap-2 mb-4">
            <School className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">
              ScholarSight
            </h1>
          </div>
          <CardTitle>Welcome Back</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="teacher">Teacher</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {role === 'teacher' && (
              <div className="space-y-2">
                <Label htmlFor="teacher">Teacher</Label>
                <Select value={teacher} onValueChange={setTeacher}>
                  <SelectTrigger id="teacher">
                    <SelectValue placeholder="Select your name" />
                  </SelectTrigger>
                  <SelectContent>
                    {teachers.map((t) => (
                      <SelectItem key={t.id} value={t.name}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder={role === 'admin' ? 'Default: admin' : 'Default: password'}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Logging in...' : <><LogIn className="mr-2" /> Login</>}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

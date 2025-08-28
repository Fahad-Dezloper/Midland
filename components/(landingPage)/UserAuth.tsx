"use client"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Google, Meta } from '@lobehub/icons';
import UserIcon from "components/icons/userIcon";
import Image from "next/image";
import { useState } from "react";
import { toast } from 'sonner';

const UserAuth = () => {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loggedIn, setLoggedIn] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)
    try {
      if (mode === 'login') {
        const res = await fetch('/api/login-customer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: form.email,
            password: form.password,
          }),
        })
        if (!res.ok) throw new Error('Login failed')
        setSuccess('Logged in successfully')
        toast.success('Logged in successfully')
        setLoggedIn(true);
        setOpen(false)
      } else {
        const res = await fetch('/api/create-customer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: form.email,
            fullName: form.fullName,
            phone: form.phone,
            password: form.password,
          }),
        })
        if (!res.ok) throw new Error('Signup failed')
        setSuccess('Account created successfully')
        toast.success('Account created successfully')
        setLoggedIn(true);
        setOpen(false)
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  // DialogTrigger logic
  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('customer_token');
      document.cookie = 'customer_token=; path=/; max-age=0';
      setLoggedIn(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {loggedIn ? (
        <button
          className="w-fit h-fit bg-red-400"
          onClick={handleLogout}
        >
        <UserIcon />
        </button>
      ) : (
        <DialogTrigger className="text-gray-700 hover:text-primary text-sm font-medium"><UserIcon /></DialogTrigger>
      )}
      <DialogContent className="sm:max-w-3xl">
        <div className="text-3xl text-black font-semibold tracking-tight mb-2"> 
          {mode === 'login' ? 'Log in' : 'Sign Up'}
        </div>
        <div className="grid grid-cols-1 font-primary md:grid-cols-2 gap-8 items-center">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {mode === 'login' ? (
              <div className="space-y-3 ">
                <input
                  type="email"
                  name="email"
                  placeholder="Email Id"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md bg-gray-100 px-4 py-3 placeholder-gray-500 outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md bg-gray-100 px-4 py-3 placeholder-gray-500 outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                  className="rounded-md bg-gray-100 px-4 py-3 placeholder-gray-500 outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="rounded-md bg-gray-100 px-4 py-3 placeholder-gray-500 outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="rounded-md bg-gray-100 px-4 py-3 placeholder-gray-500 outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="rounded-md bg-gray-100 px-4 py-3 placeholder-gray-500 outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            )}

            {mode === 'login' && (
              <div className="flex items-center justify-between text-sm">
                <div>
                  <span className="text-gray-600">New Here ?</span>{' '}
                  <button
                    type="button"
                    className="text-primary font-medium hover:underline"
                    onClick={() => setMode('signup')}
                  >
                    Sign Up
                  </button>
                </div>
                <div>
                  <span className="text-gray-600">Forgotten Password ?</span>{' '}
                  <button type="button" className="text-primary font-medium hover:underline">Reset</button>
                </div>
              </div>
            )}

            {mode === 'signup' && (
              <div className="text-sm">
                <span className="text-gray-600">Already Have An Account ?</span>{' '}
                <button
                  type="button"
                  className="text-primary font-medium hover:underline"
                  onClick={() => setMode('login')}
                >
                  Login
                </button>
              </div>
            )}

            <button
              type="submit"
              className="mt-1 rounded-md bg-primary px-6 py-3 text-white font-medium disabled:opacity-50 hover:bg-primary/90 transition-colors"
              disabled={loading}
            >
              {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Sign Up'}
            </button>

            <div className="relative my-1">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-sm text-gray-500">
                <span className="bg-white px-2">Or</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                className="flex-1 rounded-full bg-gray-100 px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 hover:bg-gray-200 hover:shadow-sm transition"
              >
                <Google.Color size={20} />
                Google
              </button>
              <button
                type="button"
                className="flex-1 rounded-full bg-gray-100 px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 hover:bg-gray-200 hover:shadow-sm transition"
              >
                <Meta.Color size={20} />
                Facebook
              </button>
            </div>  

            {error && <div className="text-red-500 text-sm">{error}</div>}
            {success && <div className="text-green-600 text-sm">{success}</div>}
          </form>
          <div className="hidden md:flex justify-center">
            <Image src="/loginPopup3.png" alt="Auth Illustration" width={420} height={420} className="" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default UserAuth
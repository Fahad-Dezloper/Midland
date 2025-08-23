"use client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useState } from "react"

const UserAuth = () => {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [form, setForm] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
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
        setLoggedIn(true);
      } else {
        const res = await fetch('/api/create-customer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: form.email,
            firstName: form.firstName,
            lastName: form.lastName,
          }),
        })
        if (!res.ok) throw new Error('Signup failed')
        setSuccess('Account created successfully')
        setLoggedIn(true);
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
    <Dialog>
      {loggedIn ? (
        <button
          className="text-gray-700 hover:text-primary text-sm font-medium"
          onClick={handleLogout}
          type="button"
        >
          Logout
        </button>
      ) : (
        <DialogTrigger className="text-gray-700 hover:text-primary text-sm font-medium">Login</DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === 'login' ? 'Login' : 'Sign Up'}</DialogTitle>
          <DialogDescription>
            {mode === 'login' ? 'Login to your account' : 'Create a new account'}
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-4 mb-4">
          <button
            className={`px-3 py-1 rounded ${mode === 'login' ? 'bg-primary text-white' : 'bg-gray-200'}`}
            onClick={() => setMode('login')}
            type="button"
          >
            Login
          </button>
          <button
            className={`px-3 py-1 rounded ${mode === 'signup' ? 'bg-primary text-white' : 'bg-gray-200'}`}
            onClick={() => setMode('signup')}
            type="button"
          >
            Sign Up
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="border rounded px-3 py-2"
          />
          {mode === 'login' && (
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="border rounded px-3 py-2"
            />
          )}
          {mode === 'signup' && (
            <>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={form.firstName}
                onChange={handleChange}
                required
                className="border rounded px-3 py-2"
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={form.lastName}
                onChange={handleChange}
                required
                className="border rounded px-3 py-2"
              />
            </>
          )}
          <button
            type="submit"
            className="bg-primary text-white rounded px-4 py-2 mt-2 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Sign Up'}
          </button>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm">{success}</div>}
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default UserAuth
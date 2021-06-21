import { server } from './variables'

const u = {
  async register(inputs) {
    const res = await fetch(server + 'register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inputs),
    })
    const data = await res.json()
    return data
  },

  async login(inputs) {
    const res = await fetch(server + 'login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inputs),
    })
    const data = await res.json()
    if (data.success) {
      this.setLocal('token', res.headers.get('token'))
    }
    return data
  },

  async logout() {
    const res = await fetch(server + 'logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: this.getLocal('token'),
      },
    })
    const data = await res.json()
    return data
  },

  async check() {
    if (!this.getLocal('token')) return { success: false }
    const res = await fetch(server + 'check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: this.getLocal('token'),
      },
      body: JSON.stringify({ check: true }),
    })
    const data = await res.json()
    return data
  },

  async update(user) {
    const res = await fetch(server + 'update', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        token: this.getLocal('token'),
      },
      body: JSON.stringify(user),
    })
    const data = await res.json()
    return data
  },

  async changeProfilePic(formData) {
    const res = await fetch(server + 'image', {
      method: 'PATCH',
      headers: {
        token: this.getLocal('token'),
      },
      body: formData,
    })
    const data = await res.json()
    return data
  },

  async updateUsername(newUsername) {
    const res = await fetch(server + 'username', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        token: this.getLocal('token'),
      },
      body: JSON.stringify({ username: newUsername }),
    })
    const data = await res.json()
    return data
  },

  async getUsers() {
    const res = await fetch(server + 'users')
    const data = await res.json()
    return data
  },

  async getUser(_id) {
    const res = await fetch(server + 'user/' + _id)
    const data = await res.json()
    return data
  },

  setLocal(target, value) {
    localStorage.setItem(target, JSON.stringify(value))
  },

  getLocal(target) {
    return JSON.parse(localStorage.getItem(target))
  },
}

export default u

import React, { useState, useEffect } from 'react';
import DataTable from './components/DataTable';
import './UsersManagement.css';
import './AdminStyles.css';

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    full_name: '',
    role: 'user',
    is_active: true,
    avatar: ''
  });

  // Define columns for the DataTable
  const columns = [
    { key: 'id', label: 'ID' },
    { 
      key: 'avatar', 
      label: '', 
      sortable: false,
      render: (user) => (
        user.avatar ? 
        <img 
          src={user.avatar} 
          alt={user.username} 
          className="user-avatar" 
          onError={(e) => { e.target.src = 'https://via.placeholder.com/40?text=User'; }}
        /> : 
        <div className="no-avatar">
          {user.username.charAt(0).toUpperCase()}
        </div>
      )
    },
    { key: 'username', label: 'Username' },
    { key: 'email', label: 'Email' },
    { key: 'full_name', label: 'Full Name' },
    { 
      key: 'role', 
      label: 'Role',
      render: (user) => (
        <span className={`role-badge ${user.role}`}>
          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
        </span>
      )
    },
    { 
      key: 'is_active', 
      label: 'Status',
      render: (user) => (
        <span className={`status-badge ${user.is_active ? 'active' : 'inactive'}`}>
          {user.is_active ? 'Active' : 'Inactive'}
        </span>
      )
    },
    { 
      key: 'created_at', 
      label: 'Joined',
      render: (user) => {
        if (!user.created_at) return 'N/A';
        const date = new Date(user.created_at);
        return date.toLocaleDateString();
      }
    }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // In a real app, this would be an API call
      // For now, we'll use mock data
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockUsers = [
        {
          id: 1,
          username: 'admin',
          email: 'admin@example.com',
          full_name: 'Admin User',
          role: 'admin',
          is_active: true,
          avatar: 'https://via.placeholder.com/150?text=Admin',
          created_at: '2023-01-15T10:30:00Z',
          last_login: '2023-05-20T15:45:00Z'
        },
        {
          id: 2,
          username: 'johndoe',
          email: 'john.doe@example.com',
          full_name: 'John Doe',
          role: 'user',
          is_active: true,
          avatar: 'https://via.placeholder.com/150?text=John',
          created_at: '2023-02-20T08:15:00Z',
          last_login: '2023-05-18T09:30:00Z'
        },
        {
          id: 3,
          username: 'janedoe',
          email: 'jane.doe@example.com',
          full_name: 'Jane Doe',
          role: 'user',
          is_active: true,
          avatar: 'https://via.placeholder.com/150?text=Jane',
          created_at: '2023-03-10T14:20:00Z',
          last_login: '2023-05-19T11:25:00Z'
        },
        {
          id: 4,
          username: 'bobsmith',
          email: 'bob.smith@example.com',
          full_name: 'Bob Smith',
          role: 'user',
          is_active: false,
          avatar: '',
          created_at: '2023-04-05T09:45:00Z',
          last_login: '2023-04-25T16:10:00Z'
        },
        {
          id: 5,
          username: 'sarahjones',
          email: 'sarah.jones@example.com',
          full_name: 'Sarah Jones',
          role: 'moderator',
          is_active: true,
          avatar: 'https://via.placeholder.com/150?text=Sarah',
          created_at: '2023-04-15T11:30:00Z',
          last_login: '2023-05-17T13:40:00Z'
        }
      ];
      
      setUsers(mockUsers);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data. Please try again later.');
      setLoading(false);
    }
  };

  const handleAddUser = () => {
    setCurrentUser(null);
    setFormData({
      username: '',
      email: '',
      full_name: '',
      role: 'user',
      is_active: true,
      avatar: ''
    });
    setIsModalOpen(true);
  };

  const handleEditUser = (user) => {
    setCurrentUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      full_name: user.full_name || '',
      role: user.role,
      is_active: user.is_active,
      avatar: user.avatar || ''
    });
    setIsModalOpen(true);
  };

  const handleViewUser = (user) => {
    // In a real app, this might navigate to a detailed view
    const lastLogin = user.last_login ? new Date(user.last_login).toLocaleString() : 'Never';
    
    alert(`
      Username: ${user.username}
      Email: ${user.email}
      Full Name: ${user.full_name || 'N/A'}
      Role: ${user.role}
      Status: ${user.is_active ? 'Active' : 'Inactive'}
      Joined: ${user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
      Last Login: ${lastLogin}
    `);
  };

  const handleDeleteUser = (user) => {
    if (user.role === 'admin') {
      alert('Cannot delete admin users');
      return;
    }
    
    if (window.confirm(`Are you sure you want to delete "${user.username}"?`)) {
      // In a real app, this would be an API call
      setUsers(users.filter(u => u.id !== user.id));
    }
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.username.trim() || !formData.email.trim()) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Please enter a valid email address');
      return;
    }
    
    // In a real app, this would be an API call
    if (currentUser) {
      // Update existing user
      const updatedUsers = users.map(user => 
        user.id === currentUser.id ? 
        { 
          ...user, 
          ...formData,
          created_at: user.created_at,
          last_login: user.last_login
        } : 
        user
      );
      setUsers(updatedUsers);
    } else {
      // Add new user
      const newUser = {
        id: Math.max(...users.map(u => u.id), 0) + 1,
        ...formData,
        created_at: new Date().toISOString(),
        last_login: null
      };
      setUsers([...users, newUser]);
    }
    
    setIsModalOpen(false);
  };

  return (
    <div className="users-management">
      <DataTable
        title="Users Management"
        columns={columns}
        data={users}
        loading={loading}
        error={error}
        onAdd={handleAddUser}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
        onView={handleViewUser}
      />
      
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{currentUser ? 'Edit User' : 'Add New User'}</h3>
              <button className="close-button" onClick={() => setIsModalOpen(false)}>×</button>
            </div>
            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label htmlFor="username">Username *</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleFormChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="full_name">Full Name</label>
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleFormChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="role">Role</label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleFormChange}
                >
                  <option value="user">User</option>
                  <option value="moderator">Moderator</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              
              <div className="form-group checkbox-group">
                <input
                  type="checkbox"
                  id="is_active"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleFormChange}
                />
                <label htmlFor="is_active">Active Account</label>
              </div>
              
              <div className="form-group">
                <label htmlFor="avatar">Avatar URL</label>
                <input
                  type="text"
                  id="avatar"
                  name="avatar"
                  value={formData.avatar}
                  onChange={handleFormChange}
                />
              </div>
              
              {formData.avatar && (
                <div className="image-preview">
                  <img 
                    src={formData.avatar} 
                    alt="Preview" 
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=Preview'; }}
                  />
                </div>
              )}
              
              <div className="form-actions">
                <button type="button" className="cancel-button" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="save-button">
                  {currentUser ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersManagement; 
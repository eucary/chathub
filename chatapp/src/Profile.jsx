import React, { useEffect, useState } from "react";
import Navside from "./assets/Navside";
import './Profile.css'

function Profile() {
  const [displayname, setDisplayname] = useState('');
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [originalDisplayname, setOriginalDisplayname] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicUrl, setProfilePicUrl] = useState('');
  const [profilePicPreview, setProfilePicPreview] = useState('');
  const [contact, setContact] = useState('');
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [originalContact, setOriginalContact] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [originalEmail, setOriginalEmail] = useState('');
  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail');
    if (storedEmail) {
      setEmail(storedEmail);
      fetch(`http://localhost:3001/api/user?email=${encodeURIComponent(storedEmail)}`)
        .then(res => {
          if (!res.ok) throw new Error('Network response was not ok');
          return res.json();
        })
        .then(data => {
          setDisplayname(data.displayname);
          setOriginalDisplayname(data.displayname);
          setProfilePicUrl(data.profile_url);
          setContact(data.contact);
          setOriginalContact(data.contact);
          // Optionally fetch password if needed (not recommended for security)
        })
        .catch(err => {
          setError('Error fetching profile');
          console.error('Error fetching profile:', err);
        });
    } else {
      setError('No user logged in');
    }
  }, []);

  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    setDisplayname(originalDisplayname);
    setIsEditing(false);
  };

  const handleSave = async () => {
    await fetch('http://localhost:3001/api/user/update-displayname', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, displayname })
    });

    if (profilePic) {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('profilePic', profilePic);

      await fetch('http://localhost:3001/api/user/upload-profile-picture', {
        method: 'POST',
        body: formData
      });
    }

    setOriginalDisplayname(displayname);
    setIsEditing(false);
  };

  // Contact handlers
  const handleEditContact = () => setIsEditingContact(true);

  const handleCancelContact = () => {
    setContact(originalContact);
    setIsEditingContact(false);
  };

  const handleSaveContact = async () => {
    await fetch('http://localhost:3001/api/user/update-contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, contact })
    });
    setOriginalContact(contact);
    setIsEditingContact(false);
  };

  // Password handlers
  const handleEditPassword = () => setIsEditingPassword(true);

  const handleCancelPassword = () => {
    setPassword('');
    setConfirmPassword('');
    setPasswordError('');
    setIsEditingPassword(false);
  };

  const handleSavePassword = async () => {
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    // Call your backend to update password here
    await fetch('http://localhost:3001/api/user/update-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    setPassword('');
    setConfirmPassword('');
    setPasswordError('');
    setIsEditingPassword(false);
  };

  return (
    <div className="profile-body">
      <Navside/>
      <div className="profile-content">
        <h1>Account Settings</h1>
        <div className="profile-info">
          <div className="displayinfo">
            <div className="displayinfo-text">
              <h2>Display info</h2>
              <p>You can view and edit your information here.</p>
            </div>
            <div className="inputsave">
              <h3>Display Name</h3>
              <input
                value={displayname}
                placeholder="Display Name"
                readOnly={!isEditing}
                onChange={e => setDisplayname(e.target.value)}
              />
              {error && <p style={{ color: 'red' }}>{error}</p>}
              <div className="savebtn">
                {!isEditing ? (
                  <button onClick={handleEdit}>Edit</button>
                ) : (
                  <>
                    <button onClick={handleCancel}>Cancel</button>
                    <button onClick={handleSave}>Save</button>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="profilepicture">
            <h2>Profile Picture</h2>
            <p>Upload your profile picture here.</p>
            <div className="inputpic">
              {profilePicPreview ? (
                <img
                  src={profilePicPreview}
                  alt="Profile Preview"
                  style={{ width: 200, height: 200, objectFit: 'cover', borderRadius: '50%', marginLeft: 16 }}
                />
              ) : profilePicUrl ? (
                <img
                  src={`http://localhost:3001${profilePicUrl}`}
                  alt="Profile"
                  style={{ width: 200, height: 200, objectFit: 'cover', borderRadius: '50%', marginLeft: 16 }}
                />
              ) : (
                <div
                  style={{
                    width: 200,
                    height: 200,
                    borderRadius: '50%',
                    background: '#fff',
                    marginLeft: 16,
                    border: '1px solid #ccc',
                    display: 'inline-block'
                  }}
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={e => {
                  const file = e.target.files[0];
                  setProfilePic(file);
                  if (file) {
                    setProfilePicPreview(URL.createObjectURL(file));
                  } else {
                    setProfilePicPreview('');
                  }
                }}
              />
            </div>
          </div>
        </div>
        <div className="personalinfo">
          <h2>Personal Information</h2>
          <p>Manage your personal information here.</p>
          <div className="personalinfo-item">
            <div className="editinfo">
              <h3>Email</h3>
<input
  value={email}
  placeholder="Email"
  readOnly={!isEditingEmail}
  onChange={e => setEmail(e.target.value)}
/>
<h3>Contact no.</h3>
<input
  value={contact}
  placeholder={contact}
  readOnly={!isEditingEmail}
  onChange={e => setContact(e.target.value)}
/>
<div className="savebtn">
  {!isEditingEmail ? (
    <button onClick={() => {
      setOriginalEmail(email);
      setOriginalContact(contact);
      setIsEditingEmail(true);
    }}>Edit</button>
  ) : (
    <>
      <button onClick={() => {
        setEmail(originalEmail);
        setContact(originalContact);
        setIsEditingEmail(false);
      }}>Cancel</button>
      <button onClick={async () => {
        // Save email and contact to backend
        await fetch('http://localhost:3001/api/user/update-email-contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ oldEmail: originalEmail, newEmail: email, contact })
        });
        setIsEditingEmail(false);
      }}>Save</button>
    </>
  )}
</div>
            </div>
            <div className="editpassword">
              <h3>Password</h3>
              <input
                type="password"
                placeholder="Password"
                value={password}
                readOnly={!isEditingPassword}
                onChange={e => setPassword(e.target.value)}
              />
              <h3>Confirm password</h3>
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                readOnly={!isEditingPassword}
                onChange={e => setConfirmPassword(e.target.value)}
              />
              {passwordError && <p style={{ color: 'red' }}>{passwordError}</p>}
              <div className="savebtn">
                {!isEditingPassword ? (
                  <button onClick={handleEditPassword}>Edit</button>
                ) : (
                  <>
                    <button onClick={handleCancelPassword}>Cancel</button>
                    <button onClick={handleSavePassword}>Save</button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
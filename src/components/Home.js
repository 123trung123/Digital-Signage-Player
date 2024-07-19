import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { getDatabase, ref as dbRef, onDisconnect, set as setDB } from 'firebase/database';
import { getAuth, signOut } from 'firebase/auth';
import { storage } from './Config/firebaseConfig';
import { useNavigate } from 'react-router-dom';
import WaitingScreen from './WaitingScreens/WaitingScreen';
import CustomModal from './PopUp/CustomModal'; 
import useKeyCombo from './KeyCombination/useKeyCombo'; 

const firestore = getFirestore();
const database = getDatabase();
const auth = getAuth();

const Home = ({ isOnline, otherMachineStatus, userUid }) => {
  const [imageUrl, setImageUrl] = useState('');
  const [media, setMedia] = useState({ type: '', url: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  useKeyCombo(['Control', 'z'], () => {
    console.log( "worked")
    setIsModalOpen(true);
  });

  const handleModalConfirm = (input) => {
    if (input && input.toLowerCase() === 'logout') {
      handleLogout();
    }
  };

  useEffect(() => {
    const fetchMedia = async () => {
      if (!userUid) return;

      try {
        const pinsRef = collection(firestore, 'pins');
        const q = query(pinsRef, where('userId', '==', userUid), where('isActive', '==', true));
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const currentTime = new Date();
          let hasValidMedia = false;

          snapshot.forEach((doc) => {
            const data = doc.data();
            const activationTime = new Date(data.activationTime);
            const endTime = new Date(data.endTime);

            if (data.playMode === 'alwaysOn') {
              setMedia({ type: data.type, url: data.imageUrl });
              hasValidMedia = true;
            } else if (data.playMode === 'timeBased' && currentTime >= activationTime && currentTime <= endTime) {
              setMedia({ type: data.type, url: data.imageUrl });
              hasValidMedia = true;
            }
          });

          if (!hasValidMedia) {
            setMedia({ type: '', url: '' });
          }
        });

        return unsubscribe;
      } catch (error) {
        console.error('Error fetching media:', error);
      }
    };

    fetchMedia();
    const timer = setInterval(fetchMedia, 5000);

    return () => clearInterval(timer);
  }, [userUid, firestore]);

  useEffect(() => {
    const fetchImageUrl = async () => {
      if (!userUid) return;

      try {
        const pinsRef = collection(firestore, 'pins');
        const q = query(pinsRef, where('userId', '==', userUid), where('isActive', '==', true));
        const unsubscribe = onSnapshot(q, (snapshot) => {
          snapshot.forEach((doc) => {
            const data = doc.data();
            setImageUrl(data.imageUrl);
          });
        });

        return unsubscribe;
      } catch (error) {
        console.error('Error fetching image URL:', error);
      }
    };

    fetchImageUrl();
  }, [userUid, firestore]);

  useEffect(() => {
    const setUserStatus = () => {
      if (!userUid) return;

      const userStatusRef = dbRef(database, `/status/${userUid}`);
      const isOnlineForDatabase = { state: 'online', last_changed: new Date().toString() };
      const isOfflineForDatabase = { state: 'offline', last_changed: new Date().toString() };

      setDB(userStatusRef, isOnlineForDatabase);

      onDisconnect(userStatusRef).set(isOfflineForDatabase);
    };

    setUserStatus();

    return () => {
      if (userUid) {
        const userStatusRef = dbRef(database, `/status/${userUid}`);
        const isOfflineForDatabase = { state: 'offline', last_changed: new Date().toString() };
        setDB(userStatusRef, isOfflineForDatabase);
      }
    };
  }, [userUid, database]);

  return (
    <div className="App">
      {media.type === 'video' ? (
        <video
          className="video"
          src={media.url}
          autoPlay
          loop
          controls
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            objectFit: 'fill',
            zIndex: 2
          }}
        />
      ) : media.type === 'image' ? (
        <img
          className="pic"
          src={media.url}
          alt="Machine Media"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            objectFit: 'fill',
            zIndex: 2
          }}
        />
      ) : (
        <WaitingScreen />
      )}
      <CustomModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        onConfirm={handleModalConfirm}
      />
    </div>
  );
};

export default Home;

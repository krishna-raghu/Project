import React, { useState, useEffect } from 'react';

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Sidebar from './components/Sidebar';
import ProjectHub from './pages/ProjectHub';
import CreateProjectPopup from './pages/CreateProjectPopup';
import ProjectDetails from './pages/ProjectDetails';
import GraphVisualization from './pages/GraphVisualization';
import BlastRadiusAnalysis from './pages/BlastRadiusAnalysis';
import AddServicePopup from './pages/AddServicePopup';
import AddDependencyPopup from './pages/AddDependencyPopup';
import AnalyticsPage from './pages/AnalyticsPage';
import TeamManagement from './pages/TeamManagement';
import NotificationsPage from './pages/NotificationsPage';
import UserProfile from './pages/UserProfile';
import ActivityPage from './pages/ActivityPage';
import SettingsPage from './pages/SettingsPage';
import { supabase } from './supabaseClient';
import { bootstrapCurrentUser, resetCurrentUserCache } from './api';
export default function App() {

  // Start on the login page instead of home. Once you have real auth,
  // flip this based on whether a session/token already exists.
  const [activePage, setActivePage] = useState('login');
  const [pageHistory, setPageHistory] = useState([]);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [showAddService, setShowAddService] = useState(false);
  const [showAddDependency, setShowAddDependency] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [userData, setUserData] = useState(null);



  //supabase auth
  useEffect(() => {
    let active = true;

    const bootstrapSession = async (session) => {
      if (!session) {
        resetCurrentUserCache();
        if (active) {
          setUserData(null);
          setSelectedProject(null);
          setActivePage('login');
        }
        return;
      }
      try {
        const profile = await bootstrapCurrentUser();
        if (active) {
          setUserData(profile);
          setSelectedProject(null);
          setActivePage('home');
        }
      } catch (err) {
        console.error('Auth sync failed:', err);
        if (active) {
          setUserData(null);
          setActivePage('login');
        }
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => bootstrapSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      window.setTimeout(() => bootstrapSession(session), 0);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);



  /*const user = {
    name: 'Krishna Singh',
    role: 'Administrator',
    initials: 'KS',
  };*/

  // Pages that should render full-screen, without the Sidebar/main shell.
  const authPages = ['login', 'signup', 'forgot-password'];
  const isAuthPage = authPages.includes(activePage);

  const handleNavigate = (page) => {
    if (page === 'home') {
      setPageHistory([]);
    } else if (page !== activePage) {
      setPageHistory((h) => [...h, activePage]);
    }
    setActivePage(page);
  };

  const handleBack = () => {
    if (pageHistory.length > 0) {
      const prev = pageHistory[pageHistory.length - 1];
      setPageHistory((h) => h.slice(0, -1));
      setActivePage(prev);
    } else {
      setActivePage('home');
      setPageHistory([]);
    }
  };

  const handleNewProject = () => {
    setShowCreateProject(true);
  };

  const handleSelectProject = (project) => {
    setSelectedProject(project);
    setPageHistory((h) => [...h, activePage]);
    setActivePage('project-details');
  };

  const handleAddService = () => {
    setShowAddService(true);
  };

  const handleAddDependency = () => {
    setShowAddDependency(true);
  };

  const renderPage = () => {
    switch (activePage) {
      case 'login':
        return <Login onNavigate={handleNavigate} />;
      case 'signup':
        return <Signup onNavigate={handleNavigate} />;
      case 'forgot-password':
        return <ForgotPassword onNavigate={handleNavigate} />;
      case 'home':
        return (
          <ProjectHub
            userData={userData}
            onNavigate={handleNavigate}
            onNewProject={handleNewProject}
            onSelectProject={handleSelectProject}
          />
        );
      case 'project-details':
        return (
          <ProjectDetails
            project={selectedProject}
            onBack={handleBack}
            onNavigate={handleNavigate}
            onAddService={handleAddService}
            onAddDependency={handleAddDependency}
          />
        );
      case 'graph':
        return (
          <GraphVisualization
            onBack={handleBack}
            onBlastRadius={() => handleNavigate('blast-radius')}
          />
        );
      case 'blast-radius':
        return (
          <BlastRadiusAnalysis
            onBack={handleBack}
          />
        );
      case 'analytics':
        return (
          <AnalyticsPage
            onBack={handleBack}
          />
        );
      case 'teams':
        return (
          <TeamManagement
            onBack={handleBack}
            project={selectedProject}
          />
        );
      case 'alerts':
        return (
          <NotificationsPage
            onBack={handleBack}
          />
        );
      case 'activity':
        return (
          <ActivityPage
            onBack={handleBack}
          />
        );
      case 'settings':
        return (
          <SettingsPage
            onBack={handleBack}
            project={selectedProject}
          />
        );
        case 'profile':
          return (
            <UserProfile
              userData={userData}
              onBack={handleBack}
              onNavigate={handleNavigate}
            />
          );
      default:
        return (
          <ProjectHub
            userData={userData}
            onNavigate={handleNavigate}
            onNewProject={handleNewProject}
            onSelectProject={handleSelectProject}
          />
        );
    }
  };

  // Auth pages (login/signup/forgot-password) render full-screen with no
  // Sidebar and no app shell, since the user isn't "in" the app yet.
  if (isAuthPage) {
    return <div className="min-h-screen bg-dark-bg">{renderPage()}</div>;
  }

  return (
    <div className="flex min-h-screen bg-dark-bg">
      <Sidebar activePage={activePage} setActivePage={handleNavigate} user={userData} />
      <main className="flex-1 ml-56 min-h-screen overflow-auto">
        {renderPage()}
      </main>

      {showCreateProject && (
        <CreateProjectPopup
          onClose={() => setShowCreateProject(false)}
          onCreate={() => setShowCreateProject(false)}
        />
      )}

      {showAddService && (
        <AddServicePopup
          onClose={() => setShowAddService(false)}
        />
      )}

      {showAddDependency && (
        <AddDependencyPopup
          onClose={() => setShowAddDependency(false)}
        />
      )}
    </div>
  );
}

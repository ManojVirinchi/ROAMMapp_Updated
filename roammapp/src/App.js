import './App.css';
import {BrowserRouter, Routes, Route,Navigate} from 'react-router-dom'
import {Provider} from 'react-redux'
import PageNotFound from './Pages/PageNotFound';
import store from './Store/store'
import Landing from './Pages/Landing'
import AdminDashboard from './Pages/AdminDashboard'
import ManagerDashboard from './Pages/ManagerDashboard';
import CampaignDashboard from './Pages/CampaignDashboard';
import ParticipantDashboard from './Pages/ParticipantDashboard';
import ParticipantAnalysis from './Pages/PatientAnalysis';
import CreateParticipant from './Pages/CreateParticipant';
import ConfigureWatch from './Pages/ConfigureWatch';
import CreateCampaign from './Pages/CreateCampaign';
import CreateManager from './Pages/CreateManager';
import Cognitive from './Pages/Cognitive';
import CampaignTest from './Pages/CampaignTest';
import CreateCoordinator from './Pages/CreateCoordinator';
import CoordinatorPermission from './Pages/CoordinatorPermission';
import CoordinatorDashboard from './Pages/CoordinatorDashboard';
import EditConfigureWatch from './Pages/EditConfigureWatch';
import EditConfigureWatchCoordinator from './Pages/EditConfigureWatchCoordinator';

function App() {
  return (
    
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" exact element={<Landing/>} />
          {/* <Route path='/login' element={<Login/>}/> */}
          {/* <Route path='/card' element={<DescreteValueCard/>}/>
          <Route path="/home" element={<Home/>}/> */}

          
          {/* ADMIN Routes  */}
          {/* <Route path="/admin/dashboard" element={<AdminDashboard/>}/>
          <Route path="/admin/manager/dashboard" element={<ManagerDashboard/>}/>
          <Route path="/admin/campaign/dashboard" element ={<CampaignDashboard/>}/>
          <Route path="/admin/participant/dashboard" element={<ParticipantDashboard/>}/>
          <Route path="/admin/participant/analysis" element={<ParticipantAnalysis/>}/>
           */}
          {/* Manager Routes */}
          {/* <Route path="/manager/dashboard" element={<ManagerDashboard/>} />
          <Route path="/manager/campaign/dashboard" element={<CampaignDashboard/>} />
          <Route path="/manager/participant/dashboard" element={<ParticipantDashboard/>} />
          <Route path="/manager/participant/analysis" element={<ParticipantAnalysis/>} />
          <Route path="/manager/create/participant" element={<CreateParticipant/>}/>
          <Route path="/manager/create/watch" element={<ConfigureWatch/>}/> */}

    
          {/* Participant Routes */}
          {/* <Route path="/participant/dashboard" element={<ParticipantDashboard/>} />
          <Route path="/participant/analysis" element={<ParticipantAnalysis/>} /> */}
          
          <Route path="/adminDashboard" element={<AdminDashboard/>}/>
          <Route path="/managerDashboard" element={<ManagerDashboard/>} />
          <Route path="/campaignDashboard" element={<CampaignDashboard/>}/>
          <Route path="/participantDashboard" element={<ParticipantDashboard/>}/>
          <Route path="/participantAnalysis" element={<ParticipantAnalysis/>}/>
          <Route path="/createParticipant" element={<CreateParticipant/>} />
          <Route path="/configureWatch" element={<ConfigureWatch/>}/>
          <Route path="/createCampaign" element={<CreateCampaign/>}/>
          <Route path="/createManager" element={<CreateManager/>}/>
          <Route path='/cognitive' element={<Cognitive/>}/>
          <Route path="/campaignTest" element={<CampaignTest/>}/>
          <Route path="/createCoordinator" element={<CreateCoordinator/>}/>
          <Route path='/coordinatorPermission' element={<CoordinatorPermission/>}/>
          <Route path='/coordinatorDashboard' element={<CoordinatorDashboard/>}/>
          <Route path="/editConfigureWatch" element={<EditConfigureWatch/>}/>
          <Route path="/editConfigureWatchCoordinator" element={<EditConfigureWatchCoordinator/>}/>



          {/* Page Not Found */}
          <Route path="*" element={<PageNotFound/>}/>
          
        </Routes>
      </BrowserRouter>    
    </Provider>
    
  );
}

export default App;

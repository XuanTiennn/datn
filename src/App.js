import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import ProviderContext from '../src/app/ContextGlobal/index';
import './App.scss';
import MainPage from './features/Components/MainPage';
// import './Components/layout.scss'

function App() {
	return (
		<div className="App">
			<ProviderContext>
				<MainPage />
			</ProviderContext>
		</div>
	);
}

export default App;

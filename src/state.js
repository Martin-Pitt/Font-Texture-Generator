import { signal, effect, computed } from '@preact/signals';
import { persistentSignal, temporarySignal } from './lib/persistent-signal.js';


// If there is a conflicting change we might need to reset localStorage
const StateFormat = '1';
if('localStorage' in globalThis && localStorage.format !== StateFormat)
{
	localStorage.clear();
	localStorage.format = StateFormat;
}


const state = {
	// recipe: temporarySignal('recipe', null), // signal(null),
	// timeScale: persistentSignal('timeScale', 'minute'),
	// recipesUsed: signal(new Set()),
	// recipesUnlocked: computed(() => RecipesUnlocked(state.research.value)),
	// news: signal(null),
	// lastVisit: localStorage.getItem('last-visit')? new Date(localStorage.getItem('last-visit')) : new Date(),
};
// localStorage.setItem('last-visit', new Date());


export default state;
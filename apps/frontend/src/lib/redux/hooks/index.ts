/**
 * Byimaan
 */

import {useDispatch, useSelector, useStore} from 'react-redux'
import {AppDispatch, AppStore, RootState} from '../app/store';

/** To access more specfic types of root state */
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>()

/**
 * Byimaan
 * 
 * it will be used to stay up-to-date with the data of user who owns this account
 */

import { SharedSlice, SliceState } from "../../shared/custom-slice";
import { SlicePlugin } from "../../shared/plugin";

const sliceName = "redux/features/user";

const sharedSlice = new SharedSlice<any>(sliceName);

/** 
 * We will get back to this after creating a api route which will be responsible to perform crud upon the user account
 */

// Byimaan
/**
 * The purpore of this file was to make a single source of supplying RenderProp Components
 * just to increase the readbility with <RenderPropHOC.BOOLEAN defaultState={true}/>
 */
import { BOOLEANHOC } from "./boolean.client";
import { ARRAYHOC } from "./array.client";

class RenderPropHOC {

    static BOOLEAN = BOOLEANHOC;

    static ARRAY = ARRAYHOC;

};


export {RenderPropHOC}
import { useSelector } from "react-redux";
import { selectedUID, selectLoggedIN,selectSelectedLocation } from "../features/userSlice";


export function UserId() { return useSelector(selectedUID) }
export function LoggedIn() { return useSelector(selectLoggedIN) }
export function SelectedLocation(){ return useSelector(selectSelectedLocation) }


export default function useStore() {
    return {UserId: UserId(),loggedIn: LoggedIn(),selectedLocation: SelectedLocation() }
}



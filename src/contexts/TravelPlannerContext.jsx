import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { 
  fetchTrips, createTrip, updateTripApi, deleteTripApi, 
  fetchBudgets, createBudget, updateBudgetApi, deleteBudgetApi, 
  fetchPackingLists, createPackingList, updatePackingListApi, deletePackingListApi 
} from '../services/api';
import { useAuth } from './AuthContext';

const TravelPlannerContext = createContext();

export const useTravelPlanner = () => {
  const context = useContext(TravelPlannerContext);
  if (!context) {
    throw new Error('useTravelPlanner must be used within a TravelPlannerProvider');
  }
  return context;
};

const initialState = {
  trips: [],
  visitedPlaces: [],
  wishlistPlaces: [],
  packingLists: [],
  budgets: [],
  photos: [],
  currentTrip: null,
  loading: false,
  error: null
};

const travelPlannerReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'ADD_TRIP':
      return { ...state, trips: [...state.trips, action.payload] };
    
    case 'UPDATE_TRIP':
      return {
        ...state,
        trips: state.trips.map(trip => 
          trip.id === action.payload.id ? action.payload : trip
        )
      };
    
    case 'DELETE_TRIP':
      return {
        ...state,
        trips: state.trips.filter(trip => trip.id !== action.payload)
      };
    
    case 'SET_CURRENT_TRIP':
      return { ...state, currentTrip: action.payload };
    
    case 'ADD_VISITED_PLACE':
      return { ...state, visitedPlaces: [...state.visitedPlaces, action.payload] };
    
    case 'ADD_WISHLIST_PLACE':
      return { ...state, wishlistPlaces: [...state.wishlistPlaces, action.payload] };
    
    case 'REMOVE_WISHLIST_PLACE':
      return {
        ...state,
        wishlistPlaces: state.wishlistPlaces.filter(place => place.id !== action.payload)
      };
    
    case 'REMOVE_VISITED_PLACE':
      return {
        ...state,
        visitedPlaces: state.visitedPlaces.filter(place => place.id !== action.payload)
      };
    
    case 'ADD_PACKING_LIST':
      return { ...state, packingLists: [...state.packingLists, action.payload] };
    
    case 'UPDATE_PACKING_LIST':
      return {
        ...state,
        packingLists: state.packingLists.map(list => 
          list.id === action.payload.id ? action.payload : list
        )
      };

    case 'DELETE_PACKING_LIST':
      return {
        ...state,
        packingLists: state.packingLists.filter(list => list.id !== action.payload)
      };
    
    case 'ADD_BUDGET':
      return { ...state, budgets: [...state.budgets, action.payload] };
    
    case 'UPDATE_BUDGET':
      return {
        ...state,
        budgets: state.budgets.map(budget => 
          budget.id === action.payload.id ? action.payload : budget
        )
      };

    case 'DELETE_BUDGET':
      return {
        ...state,
        budgets: state.budgets.filter(budget => budget.id !== action.payload)
      };
    
    case 'ADD_PHOTO':
      return { ...state, photos: [...state.photos, action.payload] };
    
    case 'UPDATE_PHOTO':
      return {
        ...state,
        photos: state.photos.map(photo => 
          photo.id === action.payload.id ? action.payload : photo
        )
      };
    
    case 'DELETE_PHOTO':
      return {
        ...state,
        photos: state.photos.filter(photo => photo.id !== action.payload)
      };
    
    case 'LOAD_DATA':
      return { ...state, ...action.payload };
    
    default:
      return state;
  }
};

export const TravelPlannerProvider = ({ children }) => {
  const [state, dispatch] = useReducer(travelPlannerReducer, initialState);
  const { user } = useAuth(); // Only load API data if user is logged in

  // Load data from API on mount or when user changes
  useEffect(() => {
    const loadData = async () => {
      if (!user) {
        // If not logged in, just clear state or do nothing
        return;
      }
      
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const [tripsData, budgetsData, packingListsData] = await Promise.all([
          fetchTrips().catch(() => []),
          fetchBudgets().catch(() => []),
          fetchPackingLists().catch(() => [])
        ]);

        let localData = {};
        const savedData = localStorage.getItem(`travel-planner-local-${user.id}`);
        if (savedData) {
          try {
            localData = JSON.parse(savedData);
          } catch (e) {}
        }

        dispatch({ 
          type: 'LOAD_DATA', 
          payload: { 
            trips: tripsData, 
            budgets: budgetsData, 
            packingLists: packingListsData,
            visitedPlaces: localData.visitedPlaces || [],
            wishlistPlaces: localData.wishlistPlaces || [],
            photos: localData.photos || []
          } 
        });
      } catch (error) {
        console.error('Error loading data:', error);
        dispatch({ type: 'SET_ERROR', payload: error.message });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };
    
    loadData();
  }, [user]);

  // Save local-only data to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      const dataToSave = {
        visitedPlaces: state.visitedPlaces,
        wishlistPlaces: state.wishlistPlaces,
        photos: state.photos
      };
      localStorage.setItem(`travel-planner-local-${user.id}`, JSON.stringify(dataToSave));
    }
  }, [state.visitedPlaces, state.wishlistPlaces, state.photos, user]);

  const actions = {
    setLoading: (loading) => dispatch({ type: 'SET_LOADING', payload: loading }),
    setError: (error) => dispatch({ type: 'SET_ERROR', payload: error }),
    
    addTrip: async (trip) => {
      try {
        const newTrip = await createTrip(trip);
        dispatch({ type: 'ADD_TRIP', payload: newTrip });
      } catch (error) { console.error(error); }
    },
    updateTrip: async (trip) => {
      try {
        const updated = await updateTripApi(trip.id, trip);
        dispatch({ type: 'UPDATE_TRIP', payload: updated });
      } catch (error) { console.error(error); }
    },
    deleteTrip: async (tripId) => {
      try {
        await deleteTripApi(tripId);
        dispatch({ type: 'DELETE_TRIP', payload: tripId });
      } catch (error) { console.error(error); }
    },
    setCurrentTrip: (trip) => dispatch({ type: 'SET_CURRENT_TRIP', payload: trip }),
    
    addVisitedPlace: (place) => dispatch({ type: 'ADD_VISITED_PLACE', payload: { ...place, id: Date.now() } }),
    addWishlistPlace: (place) => dispatch({ type: 'ADD_WISHLIST_PLACE', payload: { ...place, id: Date.now() } }),
    removeWishlistPlace: (placeId) => dispatch({ type: 'REMOVE_WISHLIST_PLACE', payload: placeId }),
    removeVisitedPlace: (placeId) => dispatch({ type: 'REMOVE_VISITED_PLACE', payload: placeId }),
    
    addPackingList: async (packingList) => {
      try {
        const newList = await createPackingList(packingList);
        dispatch({ type: 'ADD_PACKING_LIST', payload: newList });
      } catch (error) { console.error(error); }
    },
    updatePackingList: async (packingList) => {
      try {
        const updated = await updatePackingListApi(packingList.id, packingList);
        dispatch({ type: 'UPDATE_PACKING_LIST', payload: updated });
      } catch (error) { console.error(error); }
    },
    deletePackingList: async (listId) => {
      try {
        await deletePackingListApi(listId);
        dispatch({ type: 'DELETE_PACKING_LIST', payload: listId });
      } catch (error) { console.error(error); }
    },
    
    addBudget: async (budget) => {
      try {
        const newBudget = await createBudget(budget);
        dispatch({ type: 'ADD_BUDGET', payload: newBudget });
      } catch (error) { console.error(error); }
    },
    updateBudget: async (budget) => {
      try {
        const updated = await updateBudgetApi(budget.id, budget);
        dispatch({ type: 'UPDATE_BUDGET', payload: updated });
      } catch (error) { console.error(error); }
    },
    deleteBudget: async (budgetId) => {
      try {
        await deleteBudgetApi(budgetId);
        dispatch({ type: 'DELETE_BUDGET', payload: budgetId });
      } catch (error) { console.error(error); }
    },
    
    addPhoto: (photo) => dispatch({ type: 'ADD_PHOTO', payload: { ...photo, id: Date.now(), timestamp: Date.now() } }),
    updatePhoto: (photo) => dispatch({ type: 'UPDATE_PHOTO', payload: photo }),
    deletePhoto: (photoId) => dispatch({ type: 'DELETE_PHOTO', payload: photoId })
  };

  return (
    <TravelPlannerContext.Provider value={{ state, actions }}>
      {children}
    </TravelPlannerContext.Provider>
  );
};
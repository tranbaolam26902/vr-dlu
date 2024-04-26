/* Libraries */
import { createSlice } from '@reduxjs/toolkit';
import * as uuid from 'uuid';

const initialState = {
    isShowSidebar: true,
    currentSlideId: uuid.NIL,
    progress: null
};
const learningSlice = createSlice({
    name: 'learning',
    initialState,
    reducers: {
        resetLearningSlice: (state) => {
            state.isShowSidebar = initialState.isShowSidebar;
            state.currentSlideId = initialState.currentSlideId;
        },
        showSidebar: (state) => {
            state.isShowSidebar = true;
        },
        hideSidebar: (state) => {
            state.isShowSidebar = false;
        },
        toggleSidebar: (state) => {
            state.isShowSidebar = !state.isShowSidebar;
        },
        setCurrentSlideId: (state, action) => {
            state.currentSlideId = action.payload;
        },
        setProgress: (state, action) => {
            state.progress = action.payload;
        }
    }
});

export const learningReducer = learningSlice.reducer;
export const selectLearning = (state) => state.learning;
export const { resetLearningSlice, showSidebar, hideSidebar, toggleSidebar, setCurrentSlideId, setProgress } =
    learningSlice.actions;

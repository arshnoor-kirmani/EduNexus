import { configureStore } from "@reduxjs/toolkit";
// import InstituteSlice from "@/store/ReduxSlices/InstituteSlice";
// import StudentSlice from "@/store/ReduxSlices/StudentSlice";
// import TeacherSlice from "@/store/ReduxSlices/TeacherSlice";

export const store = configureStore({
  reducer: {
    // Add your reducers here
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

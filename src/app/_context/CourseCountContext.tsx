import { createContext } from "react";
import { Notes } from "../_types/Types";

export interface ContextType {
  totalCourse: number;
  setTotalCourse: React.Dispatch<React.SetStateAction<number>>;
  ProgressPercentage: Record<string, number>;
  setProgressPercentage: React.Dispatch<React.SetStateAction<Record<string, number>>>;

}

export const CourseCountContext = createContext<ContextType>({
  totalCourse: 0,
  setTotalCourse: () => {},
  ProgressPercentage: {},
  setProgressPercentage: () => {}
});

export interface ResultDataContextType {
  Result: Notes;
  setResult: React.Dispatch<React.SetStateAction<Notes>>;
}

export const ResultDataContext = createContext<ResultDataContextType>({
  Result: {} as Notes,
  setResult: () => {},
});



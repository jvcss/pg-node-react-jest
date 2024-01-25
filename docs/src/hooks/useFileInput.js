import { useCallback } from 'react';

function useFileInput(setFile) {
  // useCallback is used to memoize the function and prevent unnecessary re-renders
  const handleFileInputChange = useCallback((event) => {
    if (event.target.files.length > 0) {
      // set the first file from the input's files array as the selected file
      setFile(event.target.files[0]);
    }
  }, [setFile]); // dependency array contains the setFile function to be memoized

  return handleFileInputChange;
}

export default useFileInput;

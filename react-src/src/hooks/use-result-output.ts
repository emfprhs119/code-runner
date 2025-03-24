import { runnerExecute } from '@backend/runner';
import { useState, useEffect } from 'react';
import { useDebouncedCallback } from 'use-debounce';

const debounceTime = 500;
export const useResultOutput = (
  runner: string,
  code: string,
  extension: string
): [loading: boolean, output: string] => {
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(true);
  const debounced = useDebouncedCallback((value) => {
    setLoading(true);
    runnerExecute(runner, value, extension).then((text) => {
      setOutput(text);
      setLoading(false);
    });
  }, debounceTime);
  useEffect(() => {
    debounced(code);
  }, [code]);
  return [loading, output];
};

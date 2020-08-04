import React, { useState, useEffect, FormEvent } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { RootState } from '@/store/rootReducer';
import { Settings } from '@/api/setting';

export const callApi = async (settings: Settings, req: Request): Promise<Response> => {
  req.headers.set('Authorization', `Bearer ${settings.gitlabToken}`);

  let res = await fetch(req);
  
  if (!res.ok) {
    return Promise.reject();
  }

  const remainingRateLimit = res.headers.get('ratelimit-remaining');
  res.headers.forEach((value, key, _) => {
    console.debug(`${key}: ${value}`);
  });
  if (typeof remainingRateLimit === 'string') {
    console.info("Remainning RateLimit: ", remainingRateLimit);
  }
  return res;
}

export const getURL = async (settings: Settings, path: string): Promise<URL> => {
  return new URL(`https://${settings.hostname}${settings.apiBasePath}${path}`);
}
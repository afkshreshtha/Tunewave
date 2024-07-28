"use client"

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const jioSavaanapi = createApi({
  reducerPath: "jioSavaanapi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://saavn.dev/api",
  }),
  endpoints: (builder) => ({
    getTopCharts: builder.query({
      query: ({query}) => `/search/playlists?query=${query}`,
    }),
    getSongsDetails: builder.query({
      query: ({ songid }) => `/playlists?id=${songid}`,
    }),
    getTopSongsDetails: builder.query({
      query: ({ songid }) => `/songs/${songid}`,
    }),
    getNewReleasesDetails: builder.query({
      query: ({ songid }) => `/albums?id=${songid}`,
    }),
    getSongsBySearch: builder.query({
      query: (searchTerm) => `/search/songs?query=${searchTerm}`,
    }),
  }),
});

export const {
  useGetTopChartsQuery,
  useGetSongsDetailsQuery,
  useGetTopSongsDetailsQuery,
  useGetNewReleasesDetailsQuery,
  useGetSongsBySearchQuery,
} = jioSavaanapi;

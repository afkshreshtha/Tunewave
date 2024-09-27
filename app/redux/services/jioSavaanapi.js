"use client"

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const jioSavaanapi = createApi({
  reducerPath: "jioSavaanapi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://tunewaveapi.vercel.app/api",
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
    getLyrics: builder.query({
      query: ({ songid }) => `/songs/${songid}/lyrics`,
    }),
    getSuggestion: builder.query({
      query: ({ songid }) => `/songs/${songid}/suggestions`,
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
  useGetLyricsQuery,
  useGetSuggestionQuery
} = jioSavaanapi;

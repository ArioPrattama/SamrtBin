import { httpRouter } from "convex/server";
import { auth } from "./auth";

const http = httpRouter();

// Mount Convex Auth's signIn / signOut / refresh routes at /api/auth/*
auth.addHttpRoutes(http);

export default http;

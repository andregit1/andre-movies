import { NextApiRequest, NextApiResponse } from "next";
import { without } from 'lodash'
import prismadb from '@/lib/prismadb'
import serverAuth from "@/lib/serverAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  try {
    // start Add movie to favorite or my list
    if (req.method === 'POST') {
      const { currentUser } = await serverAuth(req, res)
      
      const { movieId } = req.body

      const existingMovie = await prismadb.movie.findUnique({
        where: {
          id: movieId
        }
      })

      if (!existingMovie) {
        throw new Error('Invalid ID') 
      }

      const user = await prismadb.user.update({
        where: {
          email: currentUser.email || ""
        },

        data: {
          favoriteIds: {
            push: movieId
          }
        }
      })

      return res.status(200).json(user)
    }

    // delete current user's movie for their favorite list
    if (req.method === 'DELETE') {
      const { currentUser } = await serverAuth(req, res)

      const { movieId } = req.body

      const existingMovie = await prismadb.movie.findUnique({
        where: {
          id: movieId
        }
      })

      if (!existingMovie) {
        throw new Error('Invalid ID')
      }

      const updatedFavoriteIds = without(currentUser.favoriteIds, movieId)
      const updatedUser = await prismadb.user.update({
        where: {
          email: currentUser.email || ""
        },
        data: {
          favoriteIds: updatedFavoriteIds
        }
      })

      return res.status(200).json(updatedUser)
    }
    // end

    return res.status(405).end()
  } catch (error) {
    console.log(error)
    return res.status(400).end()
  }
}

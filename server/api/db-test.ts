import {
  getTagById,
  getTagBySlug,
  createTag,
  updateTag,
  activateTag,
  deleteTag,
  getTagByUUID,
} from '@/server/repositories/tagRepository'

export default defineEventHandler(async (_event) => {
  try {
    const flow = new Map()

    const createTagResult = await createTag({
      slug: 'opcoes-veganas',
      description: 'Opções veganas',
      iconName: 'opcoes-veganas',
    })

    flow.set('createTagResult', createTagResult)
    console.log('createTagResult', createTagResult)

    const getTagBySlugResult = await getTagBySlug('opcoes-veganas')

    flow.set('getTagBySlugResult', getTagBySlugResult)
    console.log('getTagBySlugResult', getTagBySlugResult)

    const getTagByUUIDResult = await getTagByUUID(getTagBySlugResult.uuid)

    flow.set('getTagByUUIDResult', getTagByUUIDResult)
    console.log('getTagByUUIDResult', getTagByUUIDResult)

    const getTagByIDResult = await getTagById(getTagBySlugResult.id)

    flow.set('getTagByIDResult', getTagByIDResult)
    console.log('getTagByIDResult', getTagByIDResult)

    const activateTagResult = await activateTag({ id: getTagBySlugResult.id })

    flow.set('activateTagResult', activateTagResult)
    console.log('activateTagResult', activateTagResult)

    const updateTagResult = await updateTag(
      { slug: 'opcoes-veganas' },
      {
        iconName: 'pedro-boiadeiro',
      },
    )

    flow.set('updateTagResult', updateTagResult)
    console.log('updateTagResult', updateTagResult)

    const deleteTagResult = await deleteTag(getTagBySlugResult.id)

    flow.set('deleteTagResult', deleteTagResult)
    console.log('deleteTagResult', deleteTagResult)

    return JSON.stringify(Object.fromEntries(Array.from(flow.entries())))
  } catch (error) {
    console.error(error)
    return {
      error: error instanceof Error ? error.message : error,
    }
  }
})

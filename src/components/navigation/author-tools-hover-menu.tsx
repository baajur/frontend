import Tippy from '@tippyjs/react'
import { useRouter } from 'next/router'
import styled from 'styled-components'

import { SubList, SubLink, SubButtonStyle } from './menu'
import { useInstanceData } from '@/contexts/instance-context'
import { useLoggedInData } from '@/contexts/logged-in-data-context'

export interface AuthorToolsData {
  type: string
  id: number
  taxonomyFolder?: boolean
  taxonomyTopic?: boolean
  revisionId?: number
  parentId?: number
  courseId?: number
  grouped?: boolean
}

export interface AuthorToolsHoverMenuProps {
  data: AuthorToolsData
}

export function AuthorToolsHoverMenu({ data }: AuthorToolsHoverMenuProps) {
  const loggedInData = useLoggedInData()
  const instanceData = useInstanceData()
  const router = useRouter()
  if (!loggedInData) return null
  const loggedInStrings = loggedInData.strings
  const entities = instanceData.strings.entities
  const lang = instanceData.lang

  if (data.type == 'Page') {
    return (
      <HoverSubList>
        {abo()}
        {convert()}
        {renderLi(
          `/page/revision/revisions/${data.id}`,
          loggedInStrings.authorMenu.history
        )}
        {log()}
        {renderLi(
          `/page/update/${data.id}`,
          loggedInStrings.authorMenu.settings
        )}
      </HoverSubList>
    )
  }

  if (
    data.type == 'Article' ||
    data.type == 'Video' ||
    data.type == 'Applet' ||
    data.type == 'Event'
  ) {
    return (
      <HoverSubList>
        {abo()}
        {history()}
        {curriculum()}
        {flag()}
        {log()}
        {trash()}
      </HoverSubList>
    )
  }

  if (data.type == 'CoursePage') {
    return (
      <HoverSubList>
        <Li>
          <Tippy
            interactive
            placement="left-end"
            content={
              <HoverSubList>
                {abo()}
                {history()}

                {renderLi(
                  `/entity/link/move/link/${data.id}/${data.courseId!}`,
                  loggedInStrings.authorMenu.moveCoursePage
                )}

                {flag()}
                {log()}
                {trash()}
              </HoverSubList>
            }
          >
            <SubLink>
              <SubButtonStyle>
                {loggedInStrings.authorMenu.thisCoursePage}
              </SubButtonStyle>
            </SubLink>
          </Tippy>
        </Li>

        <Li>
          <Tippy
            interactive
            placement="left-end"
            content={
              <HoverSubList>
                {abo(data.courseId)}
                {history(data.courseId)}

                {renderLi(
                  `/entity/create/course-page?link%5Btype%5D=link&link%5Bchild%5D=${data.courseId!}`,
                  loggedInStrings.authorMenu.addCoursePage
                )}

                {sort(data.courseId)}
                {curriculum(data.courseId)}
                {flag(data.courseId)}
                {log(data.courseId)}
                {trash(data.courseId)}
              </HoverSubList>
            }
          >
            <SubLink>
              <SubButtonStyle>
                {loggedInStrings.authorMenu.wholeCourse}
              </SubButtonStyle>
            </SubLink>
          </Tippy>
        </Li>
      </HoverSubList>
    )
  }

  if (data.type == 'Taxonomy') {
    return (
      <HoverSubList>
        {abo()}
        {renderLi(
          `/taxonomy/term/organize/${data.id}`,
          loggedInStrings.authorMenu.organize
        )}
        {log()}

        {renderNewEntity()}

        {renderLi(
          `/taxonomy/term/sort/entities/${data.id}`,
          loggedInStrings.authorMenu.sortEntities
        )}
        {renderLi(
          `/taxonomy/term/copy/batch/${data.id}`,
          loggedInStrings.authorMenu.copyItems
        )}
        {renderLi(
          `/taxonomy/term/move/batch/${data.id}`,
          loggedInStrings.authorMenu.moveItems
        )}
      </HoverSubList>
    )
  }

  if (
    data.type == '_ExerciseInline' ||
    data.type == '_ExerciseGroupInline' ||
    data.type == '_SolutionInline'
  ) {
    return (
      <HoverSubList>
        {edit()}
        {abo()}

        {history()}

        {data.type == '_ExerciseGroupInline' &&
          renderLi(
            `/entity/create/grouped-text-exercise?link%5Btype%5D=link&link%5Bchild%5D=${data.id}`,
            loggedInStrings.authorMenu.addGroupedTextExercise
          )}

        {data.type != '_SolutionInline' && sort()}

        {data.type == '_SolutionInline'
          ? renderLi(
              `/entity/link/move/link/${data.id}/${data.parentId!}`,
              data.grouped
                ? loggedInStrings.authorMenu.moveToGroupedTextExercise
                : loggedInStrings.authorMenu.moveToTextExercise
            )
          : curriculum()}

        {renderLi(
          `/entity/license/update/${data.id}`,
          loggedInStrings.authorMenu.changeLicense
        )}

        {flag()}
        {log()}
        {trash()}
      </HoverSubList>
    )
  }

  return null

  function abo(id = data.id) {
    // todo: check if entity is already subscribed
    return (
      <Tippy
        interactive
        placement="left-end"
        content={
          <HoverSubList>
            {renderLi(
              `/subscribe/${id}/0`,
              loggedInStrings.authorMenu.subscribeNotifications
            )}
            {renderLi(
              `/subscribe/${id}/1`,
              loggedInStrings.authorMenu.subscribeNotificationsAndMail
            )}
          </HoverSubList>
        }
      >
        <Li>
          <SubLink as="div" tabIndex={0}>
            <SubButtonStyle>
              ◂ {loggedInStrings.authorMenu.subscribe}
            </SubButtonStyle>
          </SubLink>
        </Li>
      </Tippy>
    )
  }

  function convert(id = data.id, rev = data.revisionId) {
    return renderLi(
      `/page/revision/create/${id}/${rev || ''}`,
      loggedInStrings.authorMenu.convert
    )
  }

  function history(id = data.id) {
    return renderLi(
      `/entity/repository/history/${id}`,
      loggedInStrings.authorMenu.history
    )
  }

  function log(id = data.id) {
    return renderLi(`/event/history/${id}`, loggedInStrings.authorMenu.log)
  }

  function curriculum(id = data.id) {
    return renderLi(
      `/entity/taxonomy/update/${id}`,
      loggedInStrings.authorMenu.editAssignments
    )
  }

  function flag(id = data.id) {
    return renderLi(`/flag/add/${id}`, loggedInStrings.authorMenu.flagContent)
  }

  function trash(id = data.id) {
    // todo: use graphql mutation
    return renderLi(`/uuid/trash/${id}`, loggedInStrings.authorMenu.moveToTrash)
  }

  function sort(id = data.id) {
    return renderLi(
      `/entity/link/order/${id}/link`,
      loggedInStrings.authorMenu.sort
    )
  }

  function edit(id = data.id) {
    return renderLi(
      `/entity/repository/add-revision/${id}`,
      loggedInStrings.authorMenu.edit
    )
  }

  function renderNewEntity() {
    const shouldRenderEvents =
      (lang === 'de' && router.asPath === '/community/veranstaltungen') ||
      (lang !== 'de' && router.asPath.startsWith('/community'))

    if (data.taxonomyFolder || data.taxonomyTopic)
      return (
        <Li>
          <Tippy
            interactive
            placement="left-end"
            content={
              <HoverSubList>
                {data.taxonomyFolder && (
                  <>
                    {renderLi(
                      `/entity/create/text-exercise?taxonomy%5Bterm%5D=${data.id}`,
                      entities.exercise
                    )}
                    {renderLi(
                      `/entity/create/text-exercise-group?taxonomy%5Bterm%5D=${data.id}`,
                      entities.exerciseGroup
                    )}
                  </>
                )}

                {data.taxonomyTopic && (
                  <>
                    {renderLi(
                      `/entity/create/article?taxonomy%5Bterm%5D=${data.id}`,
                      entities.article
                    )}
                    {renderLi(
                      `/entity/create/course?taxonomy%5Bterm%5D=${data.id}`,
                      entities.course
                    )}
                    {renderLi(
                      `/entity/create/video?taxonomy%5Bterm%5D=${data.id}`,
                      entities.video
                    )}
                    {renderLi(
                      `/entity/create/applet?taxonomy%5Bterm%5D=${data.id}`,
                      entities.applet
                    )}
                    {shouldRenderEvents &&
                      renderLi(
                        `/entity/create/event?taxonomy%5Bterm%5D=${data.id}`,
                        entities.event
                      )}
                  </>
                )}
              </HoverSubList>
            }
          >
            <SubLink as="div" tabIndex={0}>
              <SubButtonStyle>
                ◂ {loggedInStrings.authorMenu.newEntity}
              </SubButtonStyle>
            </SubLink>
          </Tippy>
        </Li>
      )
  }

  function renderLi(href: string, text: string) {
    return (
      <Li>
        <SubLink href={href} noCSR>
          <SubButtonStyle>{text}</SubButtonStyle>
        </SubLink>
      </Li>
    )
  }
}

const HoverSubList = styled(SubList)`
  background-color: ${(props) => props.theme.colors.lightBackground};
`

const Li = styled.li`
  display: block;
`

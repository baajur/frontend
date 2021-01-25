import { PageInfo } from '@serlo/api'
import { gql } from 'graphql-request'
import React from 'react'
import styled from 'styled-components'

import { createAuthAwareGraphqlFetch } from '@/api/graphql-fetch'
import { useAuth } from '@/auth/use-auth'
import { LoadingSpinner } from '@/components/loading/loading-spinner'
import { Notification, NotificationEvent } from '@/components/user/notification'
import { useInstanceData } from '@/contexts/instance-context'
import { useLoggedInData } from '@/contexts/logged-in-data-context'
import { makePrimaryButton } from '@/helper/css'

interface NotificationProps {
  data: {
    nodes: {
      id: number
      event: NotificationEvent
      unread: boolean
    }[]
    pageInfo: PageInfo
  }
  loadMore: () => void
  isLoading: boolean
}

export const Notifications = ({
  data,
  loadMore,
  isLoading,
}: NotificationProps) => {
  const auth = useAuth()

  React.useEffect(() => {
    setAllToRead()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth, data])

  const { strings } = useInstanceData()
  const loggedInData = useLoggedInData()
  if (!loggedInData) return null
  const loggedInStrings = loggedInData.strings.notifications

  const notifications = data.nodes.map((node) => {
    return (
      <Notification
        key={node.id}
        event={node.event}
        unread={node.unread}
        loggedInStrings={loggedInStrings}
      />
    )
  })

  return (
    <>
      {notifications}
      {isLoading && <LoadingSpinner text={strings.loading.isLoading} />}
      {data?.pageInfo.hasNextPage && !isLoading ? (
        <Button
          onClick={() => {
            loadMore()
          }}
        >
          {loggedInStrings.loadMore}
        </Button>
      ) : null}
    </>
  )

  function setAllToRead() {
    if (auth.current === null) return

    const unreadIds = data?.nodes.flatMap((node) =>
      node.unread ? [node.id] : []
    )
    const setToRead = async () => {
      const input = {
        query: gql`
          mutation setState($input: NotificationSetStateInput!) {
            notification {
              setState(input: $input) {
                success
              }
            }
          }
        `,
        variables: {
          input: {
            id: unreadIds,
            unread: false,
          },
        },
      }
      await createAuthAwareGraphqlFetch(auth)(JSON.stringify(input))
    }
    void setToRead()
  }
}

const Button = styled.button`
  ${makePrimaryButton}
  margin-top: 40px;
`

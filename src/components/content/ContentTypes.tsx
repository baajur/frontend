import React from 'react'
import dynamic from 'next/dynamic'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShareAlt, faPencilAlt } from '@fortawesome/free-solid-svg-icons'

import ShareModal from '../navigation/ShareModal'

import Ups from '../Ups'
import WipHint from '../WipHint'
import styled from 'styled-components'
import Breadcrumbs from '../navigation/Breadcrumbs'
import { StyledP } from '../tags/StyledP'
import { StyledUl } from '../tags/StyledUl'
import { StyledLi } from '../tags/StyledLi'
import { StyledA } from '../tags/StyledA'
import { StyledH1 } from '../tags/StyledH1'
import { ToolLine } from '../navigation/ToolLine'
import { ToolLineButton } from '../navigation/ToolLineButton'
import { createEditor, Editor } from 'slate'
import withArticle from '../../schema/articleNormalizer'
import Article from '../../schema/articleRenderer'
import Create from '../../content-api/create'
import Toolbox from '../navigation/Toolbox'
import { convertEdtrioState } from '../../schema/convertEdtrioState'
import EdtrIoRenderer from '../../content-api/transform-edtr-io-state'
import convertLegacyState from '../../schema/convertLegacyState'

export default function ContentTypes(props) {
  const { data } = props
  if (data.contentType === 'article' || data.contentType === 'Page revision') {
    return <RenderArticle content={data.data} />
  }
  if (data.contentType === 'topic' || data.contentType === 'subject') {
    return (
      <>
        <WipHint part="Taxonomie" />
        {data.data.breadcrumbs && (
          <Breadcrumbs entries={data.data.breadcrumbs} />
        )}
        <StyledH1>{data.data.title}</StyledH1>
        <StyledUl>
          {data.data.anchors.map((entry, index) => (
            <StyledLi key={index}>
              <StyledA href={entry.href}>{entry.title}</StyledA>
            </StyledLi>
          ))}
        </StyledUl>
      </>
    )
  }
  if (
    data.contentType === 'topic-folder' ||
    data.contentType === 'text-exercise'
  ) {
    return (
      <>
        <WipHint part="Aufgaben" />
        {data.data.breadcrumbs && (
          <Breadcrumbs entries={data.data.breadcrumbs} />
        )}
        <StyledH1>Aufgaben</StyledH1>
        {data.data.contents.map((entry, index) => (
          <>
            <hr key={index} />
            <EdtrIoRenderer state={JSON.parse(entry)} key={index + '__x'} />
          </>
        ))}
        <hr />
        <StyledP>
          <small>
            Inhalte im alten Format werden nicht angezeigt, Anzahl:{' '}
            {data.data.legacyCount}
          </small>
        </StyledP>
      </>
    )
  }
  return <Ups type={data.contentType} />
}

function RenderArticle({ content }) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState(undefined)
  const [editMode, setEditMode] = React.useState(false)
  if (!value && content.edtrio) {
    const edtrio = JSON.parse(content.edtrio)
    const value = convertEdtrioState(edtrio)
    const editor = withArticle(createEditor())
    editor.children = value.children
    Editor.normalize(editor, { force: true })
    setValue(editor.children)
  }
  if (!value && content.legacy) {
    const value: any = convertLegacyState(content.legacy)
    const editor = withArticle(createEditor())
    editor.children = value.children
    Editor.normalize(editor, { force: true })
    setValue(editor.children)
  }
  if (editMode) {
    return (
      <Create
        defaultValue={value}
        onExit={() => setEditMode(false)}
        onChange={value => setValue(value)}
        title={content.title}
      />
    )
  }
  if (value && value[0] && value[0].type === 'h' && value[0].level === 1) {
    setValue(value.slice(1))
  }
  return (
    <>
      <DesktopOnly>
        <WipHint part="Desktop-Ansicht" />
      </DesktopOnly>
      {content.breadcrumbs && <Breadcrumbs entries={content.breadcrumbs} />}
      <StyledH1 displayMode>{content.title}</StyledH1>
      <ToolLine>
        {content.legacy && (
          <LegacyIndicator title="Inhalt im alten Format">L</LegacyIndicator>
        )}
        <ToolLineButton onClick={() => setOpen(true)}>
          <FontAwesomeIcon icon={faShareAlt} size="1x" /> Teilen
        </ToolLineButton>
        <ToolLineButton
          onClick={() => {
            setEditMode(true)
          }}
        >
          <FontAwesomeIcon icon={faPencilAlt} size="1x" /> Bearbeiten
        </ToolLineButton>
        {<ShareModal open={open} onClose={() => setOpen(false)} />}
      </ToolLine>

      <Toolbox
        onEdit={() => {
          setEditMode(true)
        }}
      />
      <Article value={value} />
    </>
  )
}

const DesktopOnly = styled.div`
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    display: none;
  }
`

const LegacyIndicator = styled.div`
  color: ${props => props.theme.colors.dark1};
  border: 1px solid;
  border-radius: 100px;
  height: 18px;
  width: 20px;
  margin-top: 5px;
  padding-top: 2px;
  text-align: center;
  margin-right: 4px;
  cursor: default;
  user-select: none;
`
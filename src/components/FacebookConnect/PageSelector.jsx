import { useEffect, useState } from 'react'
import { Modal, Radio, Avatar, Typography, Empty } from 'antd'

const { Text } = Typography

// Modal that lists the Facebook Pages the merchant manages and asks them to
// pick exactly one. Returns the selected page_id to the parent via onConfirm.
export default function PageSelector({ open, pages, onCancel, onConfirm, loading }) {
  const [selectedId, setSelectedId] = useState(null)

  // Reset selection when the modal opens with a fresh page list.
  useEffect(() => {
    if (open) {
      setSelectedId(pages?.[0]?.id || null)
    }
  }, [open, pages])

  const handleOk = () => {
    if (selectedId) {
      onConfirm(selectedId)
    }
  }

  return (
    <Modal
      title="Select a Facebook Page"
      open={open}
      onCancel={onCancel}
      onOk={handleOk}
      okText="Connect Page"
      okButtonProps={{ disabled: !selectedId, loading }}
      cancelButtonProps={{ disabled: loading }}
      destroyOnClose
    >
      {pages && pages.length > 0 ? (
        <Radio.Group
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          style={{ width: '100%' }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
            {pages.map((page) => (
              <label
                key={page.id}
                htmlFor={`fb-page-${page.id}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: 12,
                  borderRadius: 8,
                  border: '1px solid #f0f0f0',
                  cursor: 'pointer',
                  background: selectedId === page.id ? '#e6f4ff' : '#fff',
                }}
              >
                <Radio id={`fb-page-${page.id}`} value={page.id} />
                <Avatar src={page.picture_url} size={40}>
                  {page.name?.[0]?.toUpperCase()}
                </Avatar>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600 }}>{page.name}</div>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {page.category || 'Page'} &middot; ID: {page.id}
                  </Text>
                </div>
              </label>
            ))}
          </div>
        </Radio.Group>
      ) : (
        <Empty description="No Facebook Pages found on this account" />
      )}
    </Modal>
  )
}

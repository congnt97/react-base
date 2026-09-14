import { PlusOutlined } from '@ant-design/icons';
import {
  Card,
  Descriptions,
  Divider,
  Segmented,
  Space,
  Tag,
  Typography,
} from 'antd';
import { useState, type ReactNode } from 'react';

import { EmptyState } from '@/components/feedback/empty-state';
import { PageLoading } from '@/components/feedback/page-loading';
import { QueryBoundary } from '@/components/feedback/query-boundary';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Drawer } from '@/components/ui/drawer';
import { Form } from '@/components/ui/form';
import { Modal } from '@/components/ui/modal';
import { Popconfirm } from '@/components/ui/popconfirm';
import { SearchInput } from '@/components/ui/search-input';
import { SearchSelect } from '@/components/ui/search-select';
import { Upload } from '@/components/ui/upload';
import { useConfirm } from '@/components/ui/use-confirm';
import { ApiError } from '@/lib/api-error';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function Section({
  title,
  note,
  children,
}: {
  title: string;
  note: string;
  children: ReactNode;
}) {
  return (
    <Card className="app-card mb-6" title={title} size="small">
      <Typography.Paragraph type="secondary" className="mb-4! text-xs">
        {note}
      </Typography.Paragraph>
      {children}
    </Card>
  );
}

type Row = { id: string; name: string; owner: string };

type Branch = 'data' | 'loading' | 'error' | 'empty';

const ROWS: Row[] = [
  { id: '1', name: 'CMS nội bộ', owner: 'Lan' },
  { id: '2', name: 'Cổng khách hàng', owner: 'Minh' },
];

export function Gallery() {
  const confirm = useConfirm();
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [empty, setEmpty] = useState(false);
  const [branch, setBranch] = useState<Branch>('data');

  return (
    <>
      <Section
        title="Button"
        note="Bấm nút có hành động async 3 lần: chỉ chạy một lần, nút tự loading."
      >
        <Space wrap>
          <Button type="primary" onClick={() => wait(1200)}>
            Hành động chính
          </Button>
          <Button onClick={() => wait(1200)}>Mặc định</Button>
          <Button danger onClick={() => wait(1200)}>
            Nguy hiểm
          </Button>
          <Button type="text">Chữ</Button>
          <Button type="primary" disabled>
            Khoá
          </Button>
          <Button type="primary" size="small">
            Nhỏ
          </Button>
          <Button type="primary" size="large">
            Lớn
          </Button>
          <Button type="primary" icon={<PlusOutlined />}>
            Có icon
          </Button>
        </Space>
      </Section>

      <Section
        title="Nhập liệu"
        note="SearchInput tự tìm sau khi ngừng gõ. SearchSelect gọi server có debounce và huỷ request cũ."
      >
        <Space direction="vertical" className="w-full max-w-[420px]">
          <SearchInput
            aria-label="Tìm"
            placeholder="Tìm theo tên"
            onSearch={() => undefined}
          />
          <SearchSelect
            aria-label="Người quản lý"
            search={async (keyword) => {
              await wait(400);
              return [{ value: '1', label: `Kết quả cho ${keyword}` }];
            }}
          />
          <Upload
            accept={['application/pdf']}
            maxSizeMb={5}
            upload={async (file) => {
              await wait(600);
              return {
                url: `https://cdn.example.com/${file.name}`,
                name: file.name,
                size: file.size,
              };
            }}
          />
        </Space>
      </Section>

      <Section
        title="Form"
        note="Gửi form trả lỗi theo field từ backend: lỗi hiện ngay dưới ô, field bị khoá khi đang gửi."
      >
        <Form<{ email: string }>
          layout="vertical"
          requiredMark={false}
          className="max-w-[420px]"
          initialValues={{ email: 'lan@example.com' }}
          onSubmit={async () => {
            await wait(800);
            throw new ApiError('Dữ liệu không hợp lệ', {
              statusCode: 422,
              fieldErrors: { email: 'Email đã tồn tại' },
            });
          }}
        >
          <Form.Item label="Email" name="email">
            <SearchInput aria-label="Email" onSearch={() => undefined} />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Gửi thử
          </Button>
        </Form>
      </Section>

      <Section
        title="Lớp phủ"
        note="Modal và Drawer khoá mask, ESC và nút đóng khi đang gửi. Popconfirm chặn xác nhận trùng."
      >
        <Space wrap>
          <Button onClick={() => setModalOpen(true)}>Mở Modal</Button>
          <Button onClick={() => setDrawerOpen(true)}>Mở Drawer</Button>
          <Popconfirm
            title="Xoá dòng này?"
            okText="Xoá"
            cancelText="Huỷ"
            danger
            onConfirm={() => wait(1200)}
          >
            <Button danger>Popconfirm</Button>
          </Popconfirm>
          <Button
            onClick={() =>
              confirm({
                title: 'Xoá bản ghi?',
                content: 'Hành động này không thể hoàn tác.',
                okText: 'Xoá',
                cancelText: 'Huỷ',
                danger: true,
                onConfirm: () => wait(1000),
              })
            }
          >
            useConfirm
          </Button>
        </Space>

        <Modal
          open={modalOpen}
          title="Tạo dự án"
          okText="Lưu"
          cancelText="Huỷ"
          onOk={() => wait(1500)}
          onCancel={() => setModalOpen(false)}
        >
          Bấm Lưu rồi thử bấm ra ngoài hoặc nhấn ESC khi đang chạy.
        </Modal>

        <Drawer
          open={drawerOpen}
          title="Sửa thành viên"
          size={420}
          onClose={() => setDrawerOpen(false)}
        >
          Nội dung drawer.
        </Drawer>
      </Section>

      <Section
        title="Bảng"
        note="Spinner chỉ hiện sau 200ms. Bảng rỗng bắt buộc có empty state."
      >
        <Space className="mb-3">
          <Button size="small" onClick={() => setEmpty((value) => !value)}>
            {empty ? 'Hiện dữ liệu' : 'Xem trạng thái rỗng'}
          </Button>
        </Space>
        <DataTable<Row>
          rowKey="id"
          columns={[
            { title: 'Tên', dataIndex: 'name' },
            { title: 'Phụ trách', dataIndex: 'owner', width: 160 },
          ]}
          list={{
            items: empty ? [] : ROWS,
            total: empty ? 0 : ROWS.length,
            isLoading: false,
            isRefreshing: false,
          }}
          page={1}
          pageSize={10}
          onPageChange={() => undefined}
          emptyState={
            <EmptyState
              title="Chưa có dữ liệu"
              description="Tạo mục đầu tiên."
            />
          }
          showTotal={(total) => `${total} dòng`}
        />
      </Section>

      <Section
        title="Trạng thái"
        note="Bốn nhánh bắt buộc của mọi màn có dữ liệu. Chọn từng nhánh để xem."
      >
        <Segmented
          className="mb-4"
          value={branch}
          onChange={setBranch}
          options={[
            { value: 'data', label: 'Có dữ liệu' },
            { value: 'loading', label: 'Đang tải' },
            { value: 'error', label: 'Lỗi' },
            { value: 'empty', label: 'Rỗng' },
          ]}
        />

        <div className="flex min-h-[220px] items-center justify-center rounded-lg border border-[var(--border-subtle)] p-4">
          <div className="w-full">
            <QueryBoundary
              isLoading={branch === 'loading'}
              isError={branch === 'error'}
              error={new ApiError('Mất kết nối máy chủ')}
              isEmpty={branch === 'empty'}
              onRetry={() => undefined}
              emptyState={
                <EmptyState
                  title="Chưa có dữ liệu"
                  description="Tạo mục đầu tiên để bắt đầu."
                />
              }
            >
              <Descriptions
                column={1}
                items={[
                  { key: 'name', label: 'Tên dự án', children: 'CMS nội bộ' },
                  { key: 'owner', label: 'Phụ trách', children: 'Lan' },
                ]}
              />
            </QueryBoundary>
          </div>
        </div>

        <Divider />

        <Typography.Paragraph type="secondary" className="mb-2! text-xs">
          PageLoading dùng cho cả trang, trong app cao 60vh; ở đây thu lại cho
          vừa khung.
        </Typography.Paragraph>
        <div className="rounded-lg border border-[var(--border-subtle)] [&>div]:min-h-[120px]!">
          <PageLoading />
        </div>

        <Divider />

        <Space wrap>
          <Tag color="success">Đang chạy</Tag>
          <Tag color="warning">Tạm dừng</Tag>
          <Tag color="error">Lỗi</Tag>
          <Tag>Lưu trữ</Tag>
        </Space>
      </Section>
    </>
  );
}

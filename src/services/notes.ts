import { fetchData, getApiBaseUrl, ApiResponse } from "./fetch";

export interface NoteRequest {
  title: string;
  label: string[];
  content: string;
  contentJson: string;
  noteType: number; //1读书笔记 2AI笔记 3手工
  mediaContent?: string;
  noteJson?: {
    type: string;
    url?: string;
    title?: string;
    size?: number;
    action_time?: number;
    duration?: number;
  }; // 图片视频json数据
  status: number; // 笔记状态：1-完成 0-未完成
}

// 创建笔记
export const addNoteRequest = async (
  resquestBody: NoteRequest
): Promise<ApiResponse<{ id: string }>> =>
  await fetchData<ApiResponse<{ id: string }>>(
    `${getApiBaseUrl()}/knowledge/note`,
    {
      method: "POST",
      body: JSON.stringify(resquestBody),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

// 删除笔记
export const deleteNoteRequest = async (
  noteId: string
): Promise<ApiResponse<null>> =>
  await fetchData<ApiResponse<null>>(
    `${getApiBaseUrl()}/knowledge/note/${noteId}`,
    {
      method: "DELETE",
    }
  );

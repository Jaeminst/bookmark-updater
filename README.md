# Bookmark Updater

Bookmark Updater는 Chrome 확장 프로그램으로, 사용자가 설정한 URL 매핑을 기반으로 북마크 URL을 업데이트합니다.

![screenshot](https://github.com/user-attachments/assets/30c97ae9-801d-457a-a629-9fdac82d447a)

## 주요 기능

1. **외부 URL에서 데이터 가져오기**  
   지정된 URL(예: S3와 같은 외부 저장소)에서 URL 매핑 데이터를 가져옵니다.  

2. **스토리지 연동**  
   - 외부 URL에서 데이터를 가져오지 못하면 Chrome의 `storage.sync`를 사용하여 이전에 저장된 데이터를 불러옵니다.  
   - 업데이트된 데이터를 스토리지에 저장하여 이후에 사용할 수 있습니다.

3. **유연한 데이터 매핑**  
   - 입력 형식: `oldUrl,newUrl`  
   - 여러 줄로 구성된 데이터를 한 번에 처리하여 북마크를 수정합니다.  

4. **북마크 업데이트**  
   - 설정된 URL 매핑을 기반으로 북마크 URL을 업데이트합니다.  
   - 북마크 데이터는 `chrome.bookmarks` API를 통해 직접 수정됩니다.

5. **사용자 친화적 UI**  
   - "목록 보기/수정" 버튼을 통해 URL 매핑 데이터를 확인하고 수정할 수 있습니다.  
   - "업데이트" 버튼으로 즉시 적용 가능.  

## 설치 및 설정

### 1. 프로젝트 파일 준비
1. 모든 파일을 로컬 디렉토리에 저장합니다.

```
bookmark-updater/
 ├── manifest.json
 ├── popup.html
 ├── popup.js
 └── icon.png (아이콘 이미지)
```

2. `manifest.json`에서 `host_permissions` 항목의 외부 URL을 사용 환경에 맞게 수정합니다:
```json
"host_permissions": [ "https://your-url-here.com/*" ]
```

### 2. Chrome 확장 프로그램 로드
1. **Chrome 확장 프로그램 관리 페이지**로 이동:  
   `chrome://extensions/`
2. **개발자 모드 활성화**:  
   페이지 상단 오른쪽에서 "개발자 모드"를 활성화합니다.
3. **확장 프로그램 로드**:  
   "압축 해제된 확장 프로그램 로드" 버튼을 클릭하고 프로젝트 디렉토리를 선택합니다.

---

## 사용 방법

1. **목록 보기/수정**  
   확장 프로그램 아이콘을 클릭한 후 "목록 보기/수정" 버튼을 눌러 URL 매핑 데이터를 확인하거나 수정합니다.

3. **URL 업데이트**  
   URL 매핑 데이터를 수정한 후 "업데이트" 버튼을 눌러 북마크를 수정합니다.

3. **데이터 저장**  
   수정된 URL 매핑 데이터는 자동으로 스토리지에 저장됩니다.

4. **외부 URL 데이터 활용**  
   프로그램 실행 시 외부 URL에서 데이터를 가져와 표시하며, 가져오지 못할 경우 스토리지 데이터를 대신 불러옵니다.

---

## 파일 구조
```
bookmark-updater/
 ├── manifest.json # Chrome 확장 프로그램 설정 파일
 ├── popup.html # 확장 프로그램의 UI
 ├── popup.js # 확장 프로그램의 기능 로직
 └── icon.png # 확장 프로그램 아이콘
```

---

## 주의 사항

1. **외부 URL 설정**  
   `manifest.json`의 `host_permissions`에 접근하려는 외부 URL을 정확히 추가해야 합니다.

2. **Chrome 환경**  
   이 확장 프로그램은 Chrome 브라우저에서만 작동합니다.

3. **데이터 형식**  
   URL 매핑 데이터는 반드시 `oldUrl,newUrl` 형식으로 작성해야 합니다.


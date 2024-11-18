document.addEventListener('DOMContentLoaded', () => {
  const textarea = document.getElementById('urlMappingsInput');
  const toggleButton = document.getElementById('toggleTextarea');
  const textareaContainer = document.getElementById('textareaContainer');
  const updateButton = document.getElementById('update');

  const externalUrl = 'https://your-download-url/data';

  // 데이터를 외부 URL에서 가져오고, 실패하면 스토리지에서 가져오기
  function loadData() {
    fetch(externalUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then((data) => {
        console.log('외부 URL에서 데이터를 성공적으로 가져왔습니다.');
        textarea.value = data;

        // 외부 데이터를 스토리지에 저장
        saveToStorage(data);
      })
      .catch((error) => {
        console.warn('외부 URL에서 데이터를 가져오는 중 오류 발생:', error);
        loadFromStorage(); // 스토리지에서 데이터 로드
      });
  }

  // 데이터를 스토리지에 저장
  function saveToStorage(data) {
    const mappings = data
      .split('\n')
      .filter((line) => line.includes(','))
      .map((line) => line.trim());

    chrome.storage.sync.set({ urlMappings: mappings }, () => {
      console.log('데이터가 스토리지에 저장되었습니다.');
    });
  }

  // 스토리지에서 데이터 로드
  function loadFromStorage() {
    chrome.storage.sync.get(['urlMappings'], (result) => {
      if (chrome.runtime.lastError) {
        console.error(
          '스토리지에서 데이터를 불러오는 중 에러 발생:',
          chrome.runtime.lastError
        );
        textarea.placeholder =
          '스토리지와 외부 URL에서 데이터를 가져오는 데 실패했습니다.';
        return;
      }

      if (result.urlMappings && result.urlMappings.length > 0) {
        console.log('스토리지에서 데이터를 불러왔습니다.');
        textarea.value = result.urlMappings.join('\n');
      } else {
        console.warn('스토리지에 데이터가 없습니다.');
        textarea.placeholder = `예:
old.example.com,new.example.com
legacy.example.com,modern.example.com`;
      }
    });
  }

  // 목록 보기/수정 버튼 클릭 이벤트
  toggleButton.addEventListener('click', () => {
    if (textareaContainer.classList.contains('open')) {
      textareaContainer.classList.remove('open'); // 숨기기
    } else {
      textareaContainer.classList.add('open'); // 보이기
    }
  });

  // 업데이트 버튼 클릭 이벤트
  updateButton.addEventListener('click', () => {
    const input = textarea.value;

    // 입력값을 배열로 변환
    const urlMappings = input
      .split('\n')
      .map((line) => {
        const [oldUrl, newUrl] = line.split(',');
        return { oldUrl: oldUrl?.trim(), newUrl: newUrl?.trim() };
      })
      .filter((mapping) => mapping.oldUrl && mapping.newUrl); // 유효한 매핑만 사용

    if (urlMappings.length === 0) {
      alert('유효한 URL 매핑을 입력하세요!');
      return;
    }

    // URL 매핑 저장
    chrome.storage.sync.set(
      {
        urlMappings: urlMappings.map(
          ({ oldUrl, newUrl }) => `${oldUrl},${newUrl}`
        ),
      },
      () => {
        if (chrome.runtime.lastError) {
          console.error(
            '스토리지에 데이터를 저장하는 중 에러 발생:',
            chrome.runtime.lastError
          );
          alert('데이터 저장 중 에러가 발생했습니다.');
          return;
        }
        console.log('URL 매핑이 저장되었습니다.');
      }
    );

    // 북마크 가져오기 및 업데이트
    chrome.bookmarks.getTree((bookmarks) => {
      // 북마크 순회 및 수정
      function updateBookmarks(bookmarks) {
        bookmarks.forEach((bookmark) => {
          if (bookmark.url) {
            urlMappings.forEach(({ oldUrl, newUrl }) => {
              if (bookmark.url.includes(oldUrl)) {
                const updatedUrl = bookmark.url.replace(oldUrl, newUrl);
                chrome.bookmarks.update(bookmark.id, { url: updatedUrl });
                console.log(`Updated: ${bookmark.url} -> ${updatedUrl}`);
              }
            });
          }
          if (bookmark.children) {
            updateBookmarks(bookmark.children);
          }
        });
      }

      updateBookmarks(bookmarks);
      alert('Bookmarks 업데이트 완료!');
    });
  });

  // 초기 데이터 로드
  loadData();
});

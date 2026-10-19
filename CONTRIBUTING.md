# 협업 규칙

## 브랜치 전략

```
main                        운영(prod) 배포 브랜치. 직접 push 금지
staging                     운영 전 QA 및 테스트를 하는 브랜치
develop                     통합 브랜치. dev 환경 자동 배포
feature/{이슈번호}-{요약}    예) feature/12-member-signup
fix/{이슈번호}-{요약}        develop 기준 버그 수정
hotfix/{이슈번호}-{요약}     main에서 분기 → main, develop 양쪽에 머지
```

- feature / fix 브랜치는 develop에서 분기하고 develop으로 PR을 올린다.
- 일정 주기마다 staging 배포를 통해 팀원들과 공유한다.
  - staging 반영 방식: develop → staging PR 머지
  - 배포 주기: 코어타임 때 회의하면서 배포
- 운영 배포는 staging → main PR 머지로 진행한다.
- staging QA 중 발견한 버그는 QA 기간 동안 develop에 기능 머지를 멈추고, develop에서 수정 → develop → staging 재반영한다.
- hotfix는 main, develop에 머지하고, staging에는 다음 develop → staging 반영 시 포함된다. 그 전까지 staging에는 hotfix가 없는 상태임을 QA 시 감안한다.

### 브랜치-환경 매핑

| 환경    | 연결 브랜치 | 용도                       |
| ------- | ----------- | -------------------------- |
| dev     | develop     | BE·FE 연동, 기능 단위 확인 |
| staging | staging     | 운영 배포 전 QA, 팀원 공유 |
| prod    | main        | 실사용자 서비스            |

## 작업 흐름

1. **이슈 생성** — 이슈 템플릿(기능 개발 / 버그 수정 / 핫픽스)을 고르고 `브랜치 요약 (영문)`을 입력한다.
2. **브랜치 자동 생성** — `Create Issue Branch` 액션이 브랜치를 만들고 이슈에 댓글로 알려준다.
   - 기능 개발 → `develop`에서 `feature/{이슈번호}-{요약}`
   - 버그 수정 → `develop`에서 `fix/{이슈번호}-{요약}`
   - 핫픽스 → `main`에서 `hotfix/{이슈번호}-{요약}`
3. **작업 후 PR** — 브랜치 전략에 맞는 대상 브랜치로 PR을 올린다. 핫픽스는 `main`, `develop` 두 곳에 올린다.
4. **CI 통과 + Approve 1명** 후 머지한다.

## CI (GitHub Actions)

`main`, `staging`, `develop` 대상 PR마다 실행된다.

| 체크                        | 내용                                                                                          |
| --------------------------- | --------------------------------------------------------------------------------------------- |
| `Branch policy`             | PR 방향 검사 — develop ← feature/fix/hotfix, staging ← develop, main ← staging/hotfix 만 허용 |
| `Lint · Typecheck · Format` | `npm run lint`, `npm run typecheck`, `npm run format:check`                                   |

## GitHub 저장소 설정 (관리자)

- [ ] 라벨 `feature`, `fix`, `hotfix` 생성 (이슈 템플릿이 자동으로 붙임)
- [ ] `main`, `staging`, `develop` 브랜치 보호 규칙
  - [ ] 직접 push 금지 (Require a pull request before merging)
  - [ ] PR 머지 전 CI 통과 필수 — `Branch policy`, `Lint · Typecheck · Format`
  - [ ] PR 머지 전 Approve **1명** 필수
- [ ] Settings → General → **Automatically delete head branches** 켜기 (보호된 브랜치는 삭제되지 않음)

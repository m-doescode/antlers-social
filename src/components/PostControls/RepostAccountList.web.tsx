import {View} from 'react-native'
import {msg, Trans} from '@lingui/macro'
import {useLingui} from '@lingui/react'

import {sanitizeHandle} from '#/lib/strings/handles'
import {useProfilesQuery} from '#/state/queries/profile'
import {type SessionAccount, useSession} from '#/state/session'
import {UserAvatar} from '#/view/com/util/UserAvatar'
import {atoms as a} from '#/alf'
import * as Menu from '#/components/Menu'

// from AccountList.tsx
export default function RepostAccountList({
  onRepostAs,
}: {
  onRepostAs: (account: SessionAccount) => void
}) {
  const {_} = useLingui()
  const {currentAccount, accounts: accountsSrc} = useSession()
  const accounts = accountsSrc.filter(
    account => account.did !== currentAccount?.did,
  )
  const {data: profiles} = useProfilesQuery({
    handles: accounts.map(acc => acc.did),
  })

  const profileMap = Object.fromEntries(
    accounts.map(account => [
      account.did,
      profiles?.profiles.find(p => p.did === account.did),
    ]),
  )

  return (
    <>
      <Menu.LabelText>
        <Trans>Repost as</Trans>
      </Menu.LabelText>
      {accounts.map(account => {
        const profile = profileMap[account.did]
        return (
          <Menu.Item
            style={[a.gap_sm, {minWidth: 150}]}
            key={account.did}
            label={_(
              msg`Repost as ${sanitizeHandle(
                profile?.handle ?? account.handle,
                '@',
              )}`,
            )}
            onPress={() => onRepostAs(account)}>
            <View>
              <UserAvatar
                avatar={profile?.avatar}
                size={20}
                type={profile?.associated?.labeler ? 'labeler' : 'user'}
                hideLiveBadge
              />
            </View>
            <Menu.ItemText>
              {sanitizeHandle(profile?.handle ?? account.handle, '@')}
            </Menu.ItemText>
          </Menu.Item>
        )
      })}
    </>
  )
}

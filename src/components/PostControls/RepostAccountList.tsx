import {View} from 'react-native'
import {msg, Trans} from '@lingui/macro'
import {useLingui} from '@lingui/react'

import {sanitizeDisplayName} from '#/lib/strings/display-names'
import {sanitizeHandle} from '#/lib/strings/handles'
import {useProfilesQuery} from '#/state/queries/profile'
import {type SessionAccount, useSession} from '#/state/session'
import {UserAvatar} from '#/view/com/util/UserAvatar'
import {atoms as a, useTheme} from '#/alf'
import {Button} from '../Button'
import {Text} from '../Typography'

// from AccountList.tsx
export default function RepostAccountList({
  onRepostAs,
}: {
  onRepostAs: (account: SessionAccount) => void
}) {
  const t = useTheme()
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
    <View style={a.gap_xs}>
      <Text style={[a.text_2xl, a.font_bold]}>
        <Trans>Repost as</Trans>
      </Text>
      {accounts.map(account => (
        <Button
          key={account.did}
          style={[a.w_full]}
          label={_(msg`Repost as ${account.handle}`)}
          onPress={() => onRepostAs(account)}>
          {({hovered, pressed}) => (
            <View
              style={[
                a.flex_row,
                a.flex_1,
                a.gap_md,
                a.p_sm,
                a.rounded_sm,
                (hovered || pressed) && t.atoms.bg_contrast_25,
              ]}>
              <UserAvatar
                avatar={profileMap[account.did]?.avatar}
                size={36}
                type={
                  profileMap[account.did]?.associated?.labeler
                    ? 'labeler'
                    : 'user'
                }
                live={false}
                hideLiveBadge
              />
              <View style={[a.flex_1, a.gap_2xs, a.pr_2xl]}>
                <View style={[a.flex_row, a.align_center, a.gap_xs]}>
                  <Text
                    emoji
                    style={[a.font_bold, a.leading_tight]}
                    numberOfLines={1}>
                    {sanitizeDisplayName(
                      profileMap[account.did]?.displayName ||
                        profileMap[account.did]?.handle ||
                        account.handle,
                    )}
                  </Text>
                </View>
                <Text style={[a.leading_tight, t.atoms.text_contrast_medium]}>
                  {sanitizeHandle(account.handle, '@')}
                </Text>
              </View>
            </View>
          )}
        </Button>
      ))}
    </View>
  )
}

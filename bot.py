import logging
from aiogram import Bot, Dispatcher, types, F
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton
from aiogram.filters import Command
from aiogram.client.default import DefaultBotProperties
from config import BOT_TOKEN, ADMIN_ID, CHANNEL_ID, CARD_NUMBER, PAY_AMOUNT, CARD_OWNER, BANK_NAME

logging.basicConfig(level=logging.INFO)

bot = Bot(token=BOT_TOKEN, default=DefaultBotProperties(parse_mode="HTML"))
dp = Dispatcher()

# To'lov tugmasi keyboard
def get_pay_keyboard():
    return InlineKeyboardMarkup(
        inline_keyboard=[
            [InlineKeyboardButton(text="📲 To‘lov qilish", callback_data="pay")]
        ]
    )

# /start komandasi
@dp.message(Command("start"))
async def start_handler(message: types.Message):
    await message.answer(
        f"✅ Xush kelibsiz!\n"
        f"Kanalga qo‘shilish uchun <b>{PAY_AMOUNT:,} so‘m</b> to‘lov qilishingiz kerak.\n"
        f"Iltimos, to‘lovni amalga oshiring va check skrinshotini yuboring.",
        reply_markup=get_pay_keyboard()
    )

# To'lov tugmasi bosilganda
@dp.callback_query(F.data == "pay")
async def pay_handler(callback: types.CallbackQuery):
    await callback.message.answer(
        f"To‘lov uchun karta: <b>{CARD_NUMBER}</b>\n"
        f"👤 {CARD_OWNER} ({BANK_NAME})\n"
        f"💰 To‘lov summasi: <b>{PAY_AMOUNT:,} so‘m</b>\n\n"
        "✅ To‘lovni amalga oshirgach, iltimos checkni shu yerga yuboring."
    )
    await callback.answer()

# Check skrinshot kelganda
@dp.message(F.photo)
async def check_handler(message: types.Message):
    kb = InlineKeyboardMarkup(
        inline_keyboard=[[
            InlineKeyboardButton(text="✅ Tasdiqlash", callback_data=f"approve_{message.from_user.id}"),
            InlineKeyboardButton(text="❌ Rad etish", callback_data=f"decline_{message.from_user.id}")
        ]]
    )
    caption = (
        f"🧾 <b>Yangi to‘lov check</b>:\n"
        f"👤 Ismi: {message.from_user.full_name}\n"
        f"🆔 @{message.from_user.username or 'yo‘q'}\n"
        f"ID: <code>{message.from_user.id}</code>\n"
        f"Tasdiqlaysizmi?"
    )
    await bot.send_photo(
        ADMIN_ID,
        photo=message.photo[-1].file_id,
        caption=caption,
        reply_markup=kb
    )
    await message.reply("✅ Check qabul qilindi. Admin tekshiradi va tasdiqlaydi.")

# Admin tasdiqlash yoki rad etish
@dp.callback_query(F.data.startswith("approve_") | F.data.startswith("decline_"))
async def admin_action_handler(callback: types.CallbackQuery):
    if callback.from_user.id != ADMIN_ID:
        await callback.answer("Faqat admin tasdiqlashi mumkin!", show_alert=True)
        return

    user_id = int(callback.data.split("_")[1])

    if callback.data.startswith("approve_"):
        try:
            invite = await bot.create_chat_invite_link(
                chat_id=CHANNEL_ID,
                member_limit=1,
                creates_join_request=True
            )
            await bot.send_message(
                user_id,
                f"✅ To‘lov tasdiqlandi!\n"
                f"Quyidagi link orqali kanalga qo‘shilishingiz mumkin:\n\n"
                f"👉 {invite.invite_link}"
            )
            await callback.message.edit_caption(callback.message.caption + "\n✅ <b>Tasdiqlandi!</b>")
        except Exception as e:
            await callback.answer(f"Xatolik: {e}", show_alert=True)
    else:
        await bot.send_message(user_id, "❌ To‘lov rad etildi. Iltimos, to‘g‘ri check yuboring.")
        await callback.message.edit_caption(callback.message.caption + "\n❌ <b>Rad etildi!</b>")

    await callback.answer()

# Ishga tushirish
if __name__ == "__main__":
    import asyncio

    async def main():
        await dp.start_polling(bot)

    asyncio.run(main())
